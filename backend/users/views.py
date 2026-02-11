from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import HostProfile
from .serializers import (
    HostApplicationSerializer,
    HostProfileSerializer,
    HostProfileUpdateSerializer,
)

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
