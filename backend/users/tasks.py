import logging
from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(name='users.check_trial_expirations')
def check_trial_expirations():
    """
    Daily task: find trialing hosts whose trial has expired,
    update their status to cancelled, and notify them.
    """
    from .models import HostProfile, Notification
    from .log_utils import log_email_sent

    expired = HostProfile.objects.filter(
        subscription_status=HostProfile.SubscriptionStatus.TRIALING,
        trial_ends_at__lte=timezone.now(),
    ).select_related('user')

    count = 0
    for profile in expired:
        profile.subscription_status = HostProfile.SubscriptionStatus.CANCELLED
        profile.save(update_fields=['subscription_status', 'updated_at'])

        # Create in-app notification
        Notification.objects.create(
            user=profile.user,
            category=Notification.Category.SUBSCRIPTION,
            title='Trial Expired',
            message=(
                'Your 14-day free trial has expired. Your portal is now read-only. '
                'Upgrade your plan to restore full access.'
            ),
            action_url='/dashboard/subscription',
        )

        # Send email
        subject = 'Your UnitoPMS trial has expired'
        try:
            html = render_to_string('emails/trial_expired.html', {
                'host_name': profile.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject=subject,
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html,
                fail_silently=True,
            )
            log_email_sent(profile, subject, profile.user.email)
        except Exception as e:
            logger.error(f'Failed to send trial expired email to {profile.user.email}: {e}')

        count += 1

    logger.info(f'Expired {count} trial(s)')
    return {'expired': count}


@shared_task(name='users.send_trial_expiring_warnings')
def send_trial_expiring_warnings():
    """
    Daily task: warn trialing hosts whose trial expires within 3 days.
    Deduplicates by checking for existing notification in last 24h.
    """
    from .models import HostProfile, Notification
    from .log_utils import log_email_sent

    warn_before = timezone.now() + timedelta(days=3)
    expiring = HostProfile.objects.filter(
        subscription_status=HostProfile.SubscriptionStatus.TRIALING,
        trial_ends_at__gt=timezone.now(),
        trial_ends_at__lte=warn_before,
    ).select_related('user')

    count = 0
    for profile in expiring:
        days = profile.trial_days_remaining

        # Deduplicate: skip if already notified in last 24h
        already_notified = Notification.objects.filter(
            user=profile.user,
            category=Notification.Category.SUBSCRIPTION,
            title__startswith='Trial Expires',
            created_at__gte=timezone.now() - timedelta(hours=24),
        ).exists()

        if already_notified:
            continue

        Notification.objects.create(
            user=profile.user,
            category=Notification.Category.SUBSCRIPTION,
            title=f'Trial Expires in {days} Day{"s" if days != 1 else ""}',
            message=(
                f'Your free trial expires in {days} day{"s" if days != 1 else ""}. '
                'Upgrade now to keep full access to your property management tools.'
            ),
            action_url='/dashboard/subscription',
        )

        subject = f'Your UnitoPMS trial expires in {days} day{"s" if days != 1 else ""}'
        try:
            html = render_to_string('emails/trial_expiring.html', {
                'host_name': profile.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'days_remaining': days,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject=subject,
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html,
                fail_silently=True,
            )
            log_email_sent(profile, subject, profile.user.email)
        except Exception as e:
            logger.error(f'Failed to send trial warning email to {profile.user.email}: {e}')

        count += 1

    logger.info(f'Sent {count} trial expiring warning(s)')
    return {'warned': count}


@shared_task(name='users.send_payment_failure_reminders')
def send_payment_failure_reminders():
    """
    Weekly task: remind hosts with past_due payment status.
    Creates notification and sends email.
    """
    from .models import HostProfile, Notification
    from .log_utils import log_email_sent

    past_due = HostProfile.objects.filter(
        subscription_status=HostProfile.SubscriptionStatus.PAST_DUE,
    ).select_related('user')

    count = 0
    for profile in past_due:
        Notification.objects.create(
            user=profile.user,
            category=Notification.Category.PAYMENT,
            title='Payment Failed \u2014 Services Suspended',
            message=(
                'We were unable to process your payment. You can still view bookings '
                'from connected OTAs, but all other services are suspended. '
                'Please update your payment method to restore access.'
            ),
            action_url='/dashboard/subscription',
        )

        subject = 'Payment Failed \u2014 UnitoPMS Services Suspended'
        try:
            html = render_to_string('emails/payment_failed.html', {
                'host_name': profile.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject=subject,
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html,
                fail_silently=True,
            )
            log_email_sent(profile, subject, profile.user.email)
        except Exception as e:
            logger.error(f'Failed to send payment failure email to {profile.user.email}: {e}')

        count += 1

    logger.info(f'Sent {count} payment failure reminder(s)')
    return {'reminded': count}


@shared_task(name='users.check_service_end_dates')
def check_service_end_dates():
    """
    Daily task: find hosts whose service_end_date has passed and
    contract status is cancellation_requested. Updates to cancelled.
    """
    from .models import ServiceContract, Notification, ApplicationLog
    from .log_utils import create_application_log, log_email_sent

    today = timezone.now().date()
    contracts = ServiceContract.objects.filter(
        status=ServiceContract.Status.CANCELLATION_REQUESTED,
        service_end_date__lte=today,
    ).select_related('host_profile', 'host_profile__user')

    count = 0
    for contract in contracts:
        contract.status = ServiceContract.Status.CANCELLED
        contract.save(update_fields=['status', 'updated_at'])

        profile = contract.host_profile
        profile.subscription_status = profile.SubscriptionStatus.CANCELLED
        profile.save(update_fields=['subscription_status', 'updated_at'])

        # Audit log
        create_application_log(
            application=profile,
            action=ApplicationLog.Action.SERVICE_ENDED,
            note=f'Service ended. Read-only access until {contract.read_only_access_until}.',
        )

        # Notification
        Notification.objects.create(
            user=profile.user,
            category=Notification.Category.SUBSCRIPTION,
            title='Service Ended',
            message=(
                f'Your UnitoPMS service has ended. You have read-only access '
                f'until {contract.read_only_access_until}. Download your data before then.'
            ),
            action_url='/dashboard/contract',
        )

        # Email
        subject = 'Your UnitoPMS Service Has Ended'
        try:
            html = render_to_string('emails/cancellation_confirmed.html', {
                'host_name': profile.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'service_end_date': contract.service_end_date,
                'read_only_until': contract.read_only_access_until,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject=subject,
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html,
                fail_silently=True,
            )
            log_email_sent(profile, subject, profile.user.email)
        except Exception as e:
            logger.error(f'Failed to send service ended email to {profile.user.email}: {e}')

        count += 1

    logger.info(f'Ended service for {count} host(s)')
    return {'ended': count}


@shared_task(name='users.check_read_only_access_expiry')
def check_read_only_access_expiry():
    """
    Daily task: find hosts whose read_only_access_until has passed.
    Sets contract to expired and deactivates user account.
    """
    from .models import ServiceContract, Notification, ApplicationLog
    from .log_utils import create_application_log, log_email_sent

    today = timezone.now().date()
    contracts = ServiceContract.objects.filter(
        status=ServiceContract.Status.CANCELLED,
        read_only_access_until__lte=today,
    ).select_related('host_profile', 'host_profile__user')

    count = 0
    for contract in contracts:
        contract.status = ServiceContract.Status.EXPIRED
        contract.save(update_fields=['status', 'updated_at'])

        profile = contract.host_profile
        user = profile.user
        user.is_active = False
        user.save(update_fields=['is_active'])

        # Audit log
        create_application_log(
            application=profile,
            action=ApplicationLog.Action.ACCESS_EXPIRED,
            note='Read-only access expired. Account deactivated.',
        )

        # Notification (will be visible if they reactivate)
        Notification.objects.create(
            user=user,
            category=Notification.Category.SYSTEM,
            title='Portal Access Expired',
            message='Your read-only portal access has expired and your account has been deactivated.',
            action_url='/dashboard/contract',
        )

        # Email
        subject = 'Your UnitoPMS Portal Access Has Expired'
        try:
            html = render_to_string('emails/access_expired.html', {
                'host_name': user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject=subject,
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html,
                fail_silently=True,
            )
            log_email_sent(profile, subject, user.email)
        except Exception as e:
            logger.error(f'Failed to send access expired email to {user.email}: {e}')

        count += 1

    logger.info(f'Expired access for {count} host(s)')
    return {'expired': count}


@shared_task(name='users.send_access_expiry_warnings')
def send_access_expiry_warnings():
    """
    Daily task: warn hosts at 30, 7, and 1 days before
    read_only_access_until expires. Deduplicates by 24h check.
    """
    from .models import ServiceContract, Notification
    from .log_utils import log_email_sent

    today = timezone.now().date()
    warn_days = [30, 7, 1]

    count = 0
    for days in warn_days:
        target_date = today + timedelta(days=days)
        contracts = ServiceContract.objects.filter(
            status=ServiceContract.Status.CANCELLED,
            read_only_access_until=target_date,
        ).select_related('host_profile', 'host_profile__user')

        for contract in contracts:
            profile = contract.host_profile
            user = profile.user

            # Deduplicate
            already_notified = Notification.objects.filter(
                user=user,
                category=Notification.Category.SYSTEM,
                title__startswith='Access Expires',
                created_at__gte=timezone.now() - timedelta(hours=24),
            ).exists()
            if already_notified:
                continue

            Notification.objects.create(
                user=user,
                category=Notification.Category.SYSTEM,
                title=f'Access Expires in {days} Day{"s" if days != 1 else ""}',
                message=(
                    f'Your read-only portal access expires in {days} day{"s" if days != 1 else ""}. '
                    'Download your data now to keep a copy of your records.'
                ),
                action_url='/dashboard/contract',
            )

            subject = f'Your UnitoPMS access expires in {days} day{"s" if days != 1 else ""}'
            try:
                html = render_to_string('emails/access_expiring.html', {
                    'host_name': user.full_name or profile.company_name,
                    'company_name': profile.company_name,
                    'days_remaining': days,
                    'read_only_until': contract.read_only_access_until,
                    'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
                })
                send_mail(
                    subject=subject,
                    message='',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    html_message=html,
                    fail_silently=True,
                )
                log_email_sent(profile, subject, user.email)
            except Exception as e:
                logger.error(f'Failed to send access expiry warning to {user.email}: {e}')

            count += 1

    logger.info(f'Sent {count} access expiry warning(s)')
    return {'warned': count}
