from django.conf import settings as django_settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import HostProfile, ApplicationLog, ApplicationPermission
from .serializers import (
    HostApplicationSerializer,
    HostApplicationListSerializer,
    HostProfileSerializer,
    HostProfileUpdateSerializer,
    RejectApplicationSerializer,
    SetPasswordSerializer,
    ApplicationLogSerializer,
    ApplicationPermissionSerializer,
    GrantPermissionSerializer,
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
