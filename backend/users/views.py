from datetime import timedelta

from django.conf import settings as django_settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.http import JsonResponse
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    HostProfile, ApplicationLog, ApplicationPermission, Notification,
    ContractTemplate, ServiceContract, Conversation, Message,
)
from .serializers import (
    HostApplicationSerializer,
    HostApplicationListSerializer,
    HostProfileSerializer,
    HostProfileUpdateSerializer,
    HostProfileDetailSerializer,
    RejectApplicationSerializer,
    SetPasswordSerializer,
    ApplicationLogSerializer,
    ApplicationPermissionSerializer,
    GrantPermissionSerializer,
    SubscriptionStatusSerializer,
    NotificationSerializer,
    AdminSubscriptionUpdateSerializer,
    ContractTemplateSerializer,
    ServiceContractSerializer,
    ContractSignSerializer,
    CancellationRequestSerializer,
    ConversationListSerializer,
    ConversationDetailSerializer,
    SendMessageSerializer,
    CreateConversationSerializer,
)
from .permissions import (
    CanViewApplications,
    CanReviewApplications,
    CanManageApplications,
)
from .log_utils import create_application_log

User = get_user_model()


class HostApplicationView(APIView):
    """
    POST /api/auth/host-application/
    Public endpoint — creates a User + HostProfile with status=pending_review.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = HostApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()
        return Response(
            {
                'message': 'Application received. We will review and contact you within 24 hours.',
                'email': profile.user.email,
                'status': profile.status,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    Returns JWT access + refresh tokens along with host profile data.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'message': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'message': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {'message': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {'message': 'Your account is pending approval. Please wait for confirmation.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)

        data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'is_host': user.is_host,
            },
        }

        # Include host profile if exists
        if user.is_host and hasattr(user, 'host_profile'):
            data['host_profile'] = HostProfileSerializer(user.host_profile).data

        return Response(data, status=status.HTTP_200_OK)


class HostProfileView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/auth/profile/ — returns the logged-in host's profile.
    PATCH/PUT /api/auth/profile/ — updates editable fields.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return HostProfile.objects.get(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return HostProfileUpdateSerializer
        return HostProfileSerializer


# ── Application Management (Admin) ──────────────────────────────────────────


class ApplicationListView(generics.ListAPIView):
    """
    GET /api/auth/applications/
    Staff with at least 'view' permission. Returns all host applications.
    Supports filtering via ?status=pending_review|approved|rejected
    """
    permission_classes = [CanViewApplications]
    serializer_class = HostApplicationListSerializer

    def get_queryset(self):
        qs = HostProfile.objects.select_related(
            'user', 'approved_by', 'rejected_by'
        ).all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs.order_by('-created_at')


class ApplicationApproveView(APIView):
    """
    POST /api/auth/applications/<id>/approve/
    Staff with 'review' permission. Approves and returns a set-password URL.
    Also works for already-approved applications (to re-generate the link).
    """
    permission_classes = [CanReviewApplications]

    def post(self, request, pk):
        try:
            profile = HostProfile.objects.select_related('user').get(pk=pk)
        except HostProfile.DoesNotExist:
            return Response(
                {'message': 'Application not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        is_resend = profile.status == HostProfile.Status.APPROVED

        if profile.status not in (
            HostProfile.Status.PENDING_REVIEW,
            HostProfile.Status.APPROVED,
        ):
            return Response(
                {'message': f'Application is already {profile.status}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update profile status
        profile.status = HostProfile.Status.APPROVED
        profile.approved_at = timezone.now()
        profile.approved_by = request.user
        profile.save(update_fields=[
            'status', 'approved_at', 'approved_by', 'updated_at',
        ])

        # Generate set-password token
        user = profile.user
        token_generator = PasswordResetTokenGenerator()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        frontend_url = getattr(
            django_settings, 'FRONTEND_URL', 'https://unitopms.com'
        )
        set_password_url = f'{frontend_url}/set-password?uid={uid}&token={token}'

        # Create audit log
        create_application_log(
            application=profile,
            action=(
                ApplicationLog.Action.LINK_RESENT if is_resend
                else ApplicationLog.Action.APPROVED
            ),
            actor=request.user,
            request=request,
            note=f'Set-password link generated for {user.email}',
        )

        return Response({
            'message': 'Application approved.',
            'set_password_url': set_password_url,
            'email': user.email,
            'full_name': user.full_name,
        }, status=status.HTTP_200_OK)


class ApplicationRejectView(APIView):
    """
    POST /api/auth/applications/<id>/reject/
    Staff with 'review' permission. Rejects a host application with optional reason.
    """
    permission_classes = [CanReviewApplications]

    def post(self, request, pk):
        try:
            profile = HostProfile.objects.select_related('user').get(pk=pk)
        except HostProfile.DoesNotExist:
            return Response(
                {'message': 'Application not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if profile.status != HostProfile.Status.PENDING_REVIEW:
            return Response(
                {'message': f'Application is already {profile.status}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = RejectApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reason = serializer.validated_data.get('reason', '')

        profile.status = HostProfile.Status.REJECTED
        profile.rejection_reason = reason
        profile.rejected_at = timezone.now()
        profile.rejected_by = request.user
        profile.save(update_fields=[
            'status', 'rejection_reason', 'rejected_at', 'rejected_by',
            'updated_at',
        ])

        # Create audit log
        create_application_log(
            application=profile,
            action=ApplicationLog.Action.REJECTED,
            actor=request.user,
            request=request,
            note=reason,
        )

        return Response(
            {'message': 'Application rejected.'},
            status=status.HTTP_200_OK,
        )


class SetPasswordView(APIView):
    """
    POST /api/auth/set-password/
    Public endpoint. Validates token, sets password, activates user account.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Decode UID
        try:
            uid = force_str(urlsafe_base64_decode(
                serializer.validated_data['uid']
            ))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'message': 'Invalid or expired link.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate token
        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(
            user, serializer.validated_data['token']
        ):
            return Response(
                {'message': 'Invalid or expired link.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate password strength
        try:
            validate_password(
                serializer.validated_data['password'], user=user
            )
        except Exception as e:
            return Response(
                {'message': list(e.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set password and activate
        user.set_password(serializer.validated_data['password'])
        user.is_active = True
        user.save(update_fields=['password', 'is_active'])

        # Move host profile to ACTIVE + log
        if hasattr(user, 'host_profile'):
            profile = user.host_profile
            if profile.status == HostProfile.Status.APPROVED:
                profile.status = HostProfile.Status.ACTIVE
                profile.onboarding_step = (
                    HostProfile.OnboardingStep.EMAIL_VERIFIED
                )
                profile.save(update_fields=[
                    'status', 'onboarding_step', 'updated_at',
                ])

            create_application_log(
                application=profile,
                action=ApplicationLog.Action.PASSWORD_SET,
                actor=user,
                request=request,
                note='Host set their password and account was activated.',
            )

        return Response(
            {'message': 'Password set successfully. You can now log in.'},
            status=status.HTTP_200_OK,
        )


# ── Application Logs ────────────────────────────────────────────────────────


class ApplicationLogListView(generics.ListAPIView):
    """
    GET /api/auth/applications/<id>/logs/
    Staff with 'view' permission. Returns activity logs for an application.
    """
    permission_classes = [CanViewApplications]
    serializer_class = ApplicationLogSerializer

    def get_queryset(self):
        return ApplicationLog.objects.select_related('actor').filter(
            application_id=self.kwargs['pk']
        )


class HostProfileDetailView(generics.RetrieveAPIView):
    """
    GET /api/auth/applications/<id>/profile/
    Staff with 'view' permission. Returns full host profile with completeness data.
    """
    permission_classes = [CanViewApplications]
    serializer_class = HostProfileDetailSerializer

    def get_queryset(self):
        return HostProfile.objects.select_related(
            'user', 'approved_by', 'rejected_by'
        )


# ── Application Permissions Management ──────────────────────────────────────


class ApplicationPermissionListView(generics.ListAPIView):
    """
    GET /api/auth/applications/permissions/
    Staff with 'manage' permission. Lists all application permissions.
    """
    permission_classes = [CanManageApplications]
    serializer_class = ApplicationPermissionSerializer

    def get_queryset(self):
        return ApplicationPermission.objects.select_related(
            'user', 'granted_by'
        ).all().order_by('user__email', 'permission')


class GrantApplicationPermissionView(APIView):
    """
    POST /api/auth/applications/permissions/
    Staff with 'manage' permission. Grant a permission to a staff user.
    """
    permission_classes = [CanManageApplications]

    def post(self, request):
        serializer = GrantPermissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(pk=serializer.validated_data['user_id'])
        perm_value = serializer.validated_data['permission']

        perm, created = ApplicationPermission.objects.get_or_create(
            user=user,
            permission=perm_value,
            defaults={'granted_by': request.user},
        )

        if not created:
            return Response(
                {'message': 'Permission already granted.'},
                status=status.HTTP_200_OK,
            )

        return Response(
            ApplicationPermissionSerializer(perm).data,
            status=status.HTTP_201_CREATED,
        )


class RevokeApplicationPermissionView(APIView):
    """
    DELETE /api/auth/applications/permissions/<id>/
    Staff with 'manage' permission. Revoke a specific permission.
    """
    permission_classes = [CanManageApplications]

    def delete(self, request, pk):
        try:
            perm = ApplicationPermission.objects.get(pk=pk)
        except ApplicationPermission.DoesNotExist:
            return Response(
                {'message': 'Permission not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        perm.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StaffListView(generics.ListAPIView):
    """
    GET /api/auth/staff/
    Staff with 'manage' permission. Lists staff users for permission assignment.
    """
    permission_classes = [CanManageApplications]

    def get(self, request):
        staff = User.objects.filter(is_staff=True).values(
            'id', 'email', 'full_name'
        ).order_by('email')
        return Response(list(staff))


# ── Subscription & Notifications ───────────────────────────────────────────


class SubscriptionStatusView(APIView):
    """
    GET /api/auth/subscription-status/
    Returns subscription info + lockdown state for the logged-in host.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_host or not hasattr(request.user, 'host_profile'):
            return Response(
                {'message': 'Not a host user.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        profile = request.user.host_profile
        data = SubscriptionStatusSerializer({
            'subscription_plan': profile.subscription_plan,
            'subscription_status': profile.subscription_status,
            'trial_ends_at': profile.trial_ends_at,
            'trial_days_remaining': profile.trial_days_remaining,
            'is_trial_expired': profile.is_trial_expired,
            'is_portal_locked': profile.is_portal_locked,
            'max_ota_connections': profile.max_ota_connections,
        }).data
        return Response(data)


class NotificationListView(generics.ListAPIView):
    """
    GET /api/auth/notifications/
    Returns paginated notifications for the logged-in user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)[:50]


class NotificationUnreadCountView(APIView):
    """
    GET /api/auth/notifications/unread-count/
    Returns unread notification count.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            user=request.user, is_read=False,
        ).count()
        return Response({'count': count})


class NotificationMarkReadView(APIView):
    """
    POST /api/auth/notifications/<id>/read/
    Marks a single notification as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response(
                {'message': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        notif.is_read = True
        notif.save(update_fields=['is_read'])
        return Response({'message': 'Marked as read.'})


class NotificationMarkAllReadView(APIView):
    """
    POST /api/auth/notifications/read-all/
    Marks all notifications as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated = Notification.objects.filter(
            user=request.user, is_read=False,
        ).update(is_read=True)
        return Response({'message': f'Marked {updated} as read.'})


class AdminSubscriptionUpdateView(APIView):
    """
    POST /api/auth/applications/<pk>/subscription/
    Admin updates a host's subscription plan/status.
    """
    permission_classes = [CanManageApplications]

    def post(self, request, pk):
        try:
            profile = HostProfile.objects.select_related('user').get(pk=pk)
        except HostProfile.DoesNotExist:
            return Response(
                {'message': 'Host profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminSubscriptionUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        update_fields = ['updated_at']
        changes = []

        if 'subscription_plan' in serializer.validated_data:
            old = profile.subscription_plan
            profile.subscription_plan = serializer.validated_data['subscription_plan']
            update_fields.append('subscription_plan')
            changes.append(f'plan: {old} → {profile.subscription_plan}')

        if 'subscription_status' in serializer.validated_data:
            old = profile.subscription_status
            profile.subscription_status = serializer.validated_data['subscription_status']
            update_fields.append('subscription_status')
            changes.append(f'status: {old} → {profile.subscription_status}')

        if 'trial_ends_at' in serializer.validated_data:
            profile.trial_ends_at = serializer.validated_data['trial_ends_at']
            update_fields.append('trial_ends_at')
            changes.append(f'trial_ends_at updated')

        profile.save(update_fields=update_fields)

        # Audit log
        create_application_log(
            application=profile,
            action=ApplicationLog.Action.STATUS_CHANGED,
            actor=request.user,
            request=request,
            note=f'Subscription updated: {", ".join(changes)}',
        )

        # Notify the host
        Notification.objects.create(
            user=profile.user,
            category=Notification.Category.SUBSCRIPTION,
            title='Subscription Updated',
            message=f'Your subscription has been updated: {", ".join(changes)}.',
            action_url='/dashboard/subscription',
        )

        return Response({
            'message': 'Subscription updated.',
            'changes': changes,
        })


# ── Contract endpoints ─────────────────────────────────────────────────────


class ContractTemplateView(APIView):
    """
    GET /api/auth/contract-template/
    Returns the currently active contract template.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        template = ContractTemplate.objects.filter(is_active=True).first()
        if not template:
            return Response(
                {'message': 'No active contract template found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(ContractTemplateSerializer(template).data)


class ContractStatusView(APIView):
    """
    GET /api/auth/contract/
    Returns the host's own contract status.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_host or not hasattr(request.user, 'host_profile'):
            return Response(
                {'message': 'Not a host user.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        profile = request.user.host_profile
        try:
            contract = profile.contract
        except ServiceContract.DoesNotExist:
            return Response({'status': 'no_contract'})
        return Response(ServiceContractSerializer(contract).data)


class ContractSignView(APIView):
    """
    POST /api/auth/contract/sign/
    Host signs the active contract template.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_host or not hasattr(request.user, 'host_profile'):
            return Response(
                {'message': 'Not a host user.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ContractSignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile = request.user.host_profile
        template = ContractTemplate.objects.filter(is_active=True).first()
        if not template:
            return Response(
                {'message': 'No active contract template.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create or update contract
        contract, created = ServiceContract.objects.get_or_create(
            host_profile=profile,
            defaults={
                'version': template.version,
                'status': ServiceContract.Status.ACTIVE,
                'signed_at': timezone.now(),
                'service_start_date': timezone.now().date(),
            },
        )

        if not created:
            if contract.status != ServiceContract.Status.PENDING:
                return Response(
                    {'message': 'Contract already signed.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            contract.version = template.version
            contract.status = ServiceContract.Status.ACTIVE
            contract.signed_at = timezone.now()
            contract.service_start_date = timezone.now().date()
            contract.save(update_fields=[
                'version', 'status', 'signed_at', 'service_start_date', 'updated_at',
            ])

        # Audit log
        create_application_log(
            application=profile,
            action=ApplicationLog.Action.CONTRACT_SIGNED,
            actor=request.user,
            request=request,
            note=f'Signed contract v{template.version}',
        )

        # In-app notification
        Notification.objects.create(
            user=request.user,
            category=Notification.Category.SYSTEM,
            title='Contract Signed',
            message='You have successfully signed the UnitoPMS service agreement.',
            action_url='/dashboard/contract',
        )

        return Response(ServiceContractSerializer(contract).data, status=status.HTTP_200_OK)


class CancellationRequestView(APIView):
    """
    POST /api/auth/contract/cancel/
    Host requests cancellation. Service ends after 2-month notice period.
    Read-only access for 365 days after service end.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_host or not hasattr(request.user, 'host_profile'):
            return Response(
                {'message': 'Not a host user.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        profile = request.user.host_profile
        try:
            contract = profile.contract
        except ServiceContract.DoesNotExist:
            return Response(
                {'message': 'No contract found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if contract.status != ServiceContract.Status.ACTIVE:
            return Response(
                {'message': f'Cannot cancel — contract status is {contract.status}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CancellationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        now = timezone.now()
        notice_months = contract.cancellation_notice_months
        # Compute service end date (now + 2 months)
        service_end = (now + timedelta(days=notice_months * 30)).date()
        read_only_until = service_end + timedelta(days=365)

        contract.status = ServiceContract.Status.CANCELLATION_REQUESTED
        contract.cancellation_requested_at = now
        contract.service_end_date = service_end
        contract.read_only_access_until = read_only_until
        contract.save(update_fields=[
            'status', 'cancellation_requested_at', 'service_end_date',
            'read_only_access_until', 'updated_at',
        ])

        # Audit log
        reason = serializer.validated_data.get('cancellation_reason', '')
        create_application_log(
            application=profile,
            action=ApplicationLog.Action.CANCELLATION_REQUESTED,
            actor=request.user,
            request=request,
            note=f'Cancellation requested. Service ends {service_end}. '
                 f'Read-only until {read_only_until}. Reason: {reason or "N/A"}',
        )

        # Notification
        Notification.objects.create(
            user=request.user,
            category=Notification.Category.SUBSCRIPTION,
            title='Cancellation Requested',
            message=(
                f'Your cancellation has been received. Service will end on {service_end}. '
                f'You will have read-only access until {read_only_until}.'
            ),
            action_url='/dashboard/contract',
        )

        # Send cancellation confirmation email
        try:
            from django.core.mail import send_mail
            from django.template.loader import render_to_string

            html = render_to_string('emails/cancellation_confirmed.html', {
                'host_name': request.user.full_name or profile.company_name,
                'company_name': profile.company_name,
                'service_end_date': service_end,
                'read_only_until': read_only_until,
                'frontend_url': getattr(django_settings, 'FRONTEND_URL', 'https://unitopms.com'),
            })
            send_mail(
                subject='Cancellation Confirmed — UnitoPMS',
                message='',
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                html_message=html,
                fail_silently=True,
            )
        except Exception:
            pass

        return Response(ServiceContractSerializer(contract).data)


class ContractDataExportView(APIView):
    """
    GET /api/auth/contract/export/
    Host downloads all their data as JSON.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_host or not hasattr(request.user, 'host_profile'):
            return Response(
                {'message': 'Not a host user.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        profile = request.user.host_profile
        user = request.user

        # Build export data
        data = {
            'user': {
                'email': user.email,
                'full_name': user.full_name,
            },
            'profile': {
                'company_name': profile.company_name,
                'country': profile.country,
                'phone': profile.phone,
                'property_type': profile.property_type,
                'num_properties': profile.num_properties,
                'num_units': profile.num_units,
                'business_type': profile.business_type,
                'address': f'{profile.address_line_1}, {profile.city}, {profile.state_province} {profile.postal_code}'.strip(', '),
                'subscription_plan': profile.subscription_plan,
                'subscription_status': profile.subscription_status,
                'created_at': str(profile.created_at),
            },
            'notifications': list(
                Notification.objects.filter(user=user).values(
                    'title', 'message', 'category', 'created_at',
                )[:200]
            ),
            'activity_logs': list(
                ApplicationLog.objects.filter(application=profile).values(
                    'action', 'note', 'created_at',
                )[:200]
            ),
            'conversations': [],
        }

        # Export conversations + messages
        for conv in Conversation.objects.filter(host=profile).prefetch_related('messages'):
            data['conversations'].append({
                'subject': conv.subject,
                'status': conv.status,
                'created_at': str(conv.created_at),
                'messages': [
                    {
                        'body': msg.body,
                        'is_from_host': msg.is_from_host,
                        'created_at': str(msg.created_at),
                    }
                    for msg in conv.messages.all()
                ],
            })

        return JsonResponse(data, json_default=str)


# ── Messaging endpoints ────────────────────────────────────────────────────


class ConversationListView(generics.ListAPIView):
    """
    GET /api/auth/conversations/
    Host sees own conversations. Admin sees all.
    Supports ?status=open|closed filter.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            qs = Conversation.objects.select_related('host', 'host__user').all()
        else:
            if not hasattr(user, 'host_profile'):
                return Conversation.objects.none()
            qs = Conversation.objects.select_related('host', 'host__user').filter(
                host=user.host_profile,
            )
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


class ConversationDetailView(APIView):
    """
    GET /api/auth/conversations/<id>/
    Returns conversation with all messages. Marks unread messages as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            conv = Conversation.objects.select_related('host', 'host__user').get(pk=pk)
        except Conversation.DoesNotExist:
            return Response(
                {'message': 'Conversation not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Access check
        user = request.user
        if not user.is_staff:
            if not hasattr(user, 'host_profile') or conv.host != user.host_profile:
                return Response(
                    {'message': 'Access denied.'},
                    status=status.HTTP_403_FORBIDDEN,
                )

        # Mark messages as read
        if user.is_staff:
            conv.messages.filter(is_from_host=True, is_read=False).update(is_read=True)
        else:
            conv.messages.filter(is_from_host=False, is_read=False).update(is_read=True)

        return Response(ConversationDetailSerializer(conv, context={'request': request}).data)


class ConversationCreateView(APIView):
    """
    POST /api/auth/conversations/
    Creates a new conversation with the first message.
    Host creates a support thread; admin can also initiate.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        is_host = user.is_host and hasattr(user, 'host_profile')

        if is_host:
            host_profile = user.host_profile
        elif user.is_staff:
            # Admin must specify host_id
            host_id = request.data.get('host_id')
            if not host_id:
                return Response(
                    {'message': 'host_id required for admin-initiated conversations.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                host_profile = HostProfile.objects.get(pk=host_id)
            except HostProfile.DoesNotExist:
                return Response(
                    {'message': 'Host not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {'message': 'Permission denied.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        conv = Conversation.objects.create(
            host=host_profile,
            subject=serializer.validated_data['subject'],
        )

        Message.objects.create(
            conversation=conv,
            sender=user,
            body=serializer.validated_data['body'],
            is_from_host=is_host,
        )

        return Response(
            ConversationDetailSerializer(conv, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class MessageSendView(APIView):
    """
    POST /api/auth/conversations/<id>/messages/
    Sends a message in an existing conversation.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            conv = Conversation.objects.get(pk=pk)
        except Conversation.DoesNotExist:
            return Response(
                {'message': 'Conversation not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        is_host = user.is_host and hasattr(user, 'host_profile')

        # Access check
        if not user.is_staff:
            if not is_host or conv.host != user.host_profile:
                return Response(
                    {'message': 'Access denied.'},
                    status=status.HTTP_403_FORBIDDEN,
                )

        if conv.status == Conversation.Status.CLOSED:
            return Response(
                {'message': 'This conversation is closed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        msg = Message.objects.create(
            conversation=conv,
            sender=user,
            body=serializer.validated_data['body'],
            is_from_host=is_host,
        )

        # Update last_message_at
        conv.last_message_at = msg.created_at
        conv.save(update_fields=['last_message_at'])

        return Response(
            ConversationDetailSerializer(conv, context={'request': request}).data,
        )


class ConversationCloseView(APIView):
    """
    POST /api/auth/conversations/<id>/close/
    Admin closes a conversation.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if not request.user.is_staff:
            return Response(
                {'message': 'Only admin can close conversations.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            conv = Conversation.objects.get(pk=pk)
        except Conversation.DoesNotExist:
            return Response(
                {'message': 'Conversation not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        conv.status = Conversation.Status.CLOSED
        conv.save(update_fields=['status'])

        return Response({'message': 'Conversation closed.'})


class HostConversationsView(generics.ListAPIView):
    """
    GET /api/auth/applications/<pk>/conversations/
    Admin views a specific host's conversations.
    """
    permission_classes = [CanViewApplications]
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        return Conversation.objects.select_related('host', 'host__user').filter(
            host_id=self.kwargs['pk'],
        )
