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
        try:
            html = render_to_string('emails/trial_expired.html', {
                'host_name': profile.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject='Your UnitoPMS trial has expired',
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html,
                fail_silently=True,
            )
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

        try:
            html = render_to_string('emails/trial_expiring.html', {
                'host_name': profile.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'days_remaining': days,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject=f'Your UnitoPMS trial expires in {days} day{"s" if days != 1 else ""}',
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html,
                fail_silently=True,
            )
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

        try:
            html = render_to_string('emails/payment_failed.html', {
                'host_name': profile.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'frontend_url': getattr(settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject='Payment Failed \u2014 UnitoPMS Services Suspended',
                message='',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html,
                fail_silently=True,
            )
        except Exception as e:
            logger.error(f'Failed to send payment failure email to {profile.user.email}: {e}')

        count += 1

    logger.info(f'Sent {count} payment failure reminder(s)')
    return {'reminded': count}
