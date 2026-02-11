from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers

from .models import HostProfile

User = get_user_model()


class HostApplicationSerializer(serializers.Serializer):
    """
    Accepts the multi-step host registration form.
    Creates a CustomUser (is_host=True) + HostProfile in one transaction.
    No password at this stage — admin reviews and sends credentials.
    """
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30)
    company_name = serializers.CharField(max_length=255)
    country = serializers.CharField(max_length=2, required=False, default='')
    country_name = serializers.CharField(max_length=100, required=False, default='')
    property_type = serializers.CharField(max_length=30)
    num_properties = serializers.IntegerField(min_value=1)
    num_units = serializers.IntegerField(min_value=1)
    referral_source = serializers.CharField(max_length=50, required=False, default='')
    marketing_opt_in = serializers.BooleanField(required=False, default=False)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value.lower()

    def create(self, validated_data):
        now = timezone.now()

        user = User.objects.create_user(
            email=validated_data['email'],
            password=None,  # no password yet — admin sends credentials after approval
            full_name=f"{validated_data['first_name']} {validated_data['last_name']}",
            is_host=True,
            is_active=False,  # inactive until admin approves
        )
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.save(update_fields=['first_name', 'last_name'])

        profile = HostProfile.objects.create(
            user=user,
            company_name=validated_data['company_name'],
            country=validated_data.get('country', ''),
            country_name=validated_data.get('country_name', ''),
            phone=validated_data['phone'],
            property_type=validated_data['property_type'],
            num_properties=validated_data['num_properties'],
            num_units=validated_data['num_units'],
            referral_source=validated_data.get('referral_source', ''),
            marketing_opt_in=validated_data.get('marketing_opt_in', False),
            terms_accepted_at=now,
            privacy_policy_accepted_at=now,
            trial_ends_at=now + timedelta(days=14),
        )
        return profile


class HostProfileSerializer(serializers.ModelSerializer):
    """Read-only serializer returned after login / profile fetch."""
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = HostProfile
        fields = [
            'id',
            'email',
            'full_name',
            'company_name',
            'country',
            'country_name',
            'phone',
            'property_type',
            'num_properties',
            'num_units',
            'status',
            'onboarding_step',
            'subscription_plan',
            'subscription_status',
            'trial_ends_at',
            'timezone',
            'default_currency',
            'preferred_language',
            'email_verified',
            'phone_verified',
            'profile_photo',
            'bio',
            'created_at',
        ]
        read_only_fields = fields


class HostProfileUpdateSerializer(serializers.ModelSerializer):
    """Allows host to update editable profile fields post-onboarding."""

    class Meta:
        model = HostProfile
        fields = [
            'company_name',
            'phone',
            'business_type',
            'legal_business_name',
            'tax_id',
            'vat_number',
            'website',
            'business_description',
            'address_line_1',
            'address_line_2',
            'city',
            'state_province',
            'postal_code',
            'timezone',
            'default_currency',
            'preferred_language',
            'profile_photo',
            'bio',
            'billing_email',
        ]


class HostApplicationListSerializer(serializers.ModelSerializer):
    """Read-only serializer for admin applications list."""
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = HostProfile
        fields = [
            'id',
            'email',
            'full_name',
            'company_name',
            'country',
            'country_name',
            'phone',
            'property_type',
            'num_properties',
            'num_units',
            'referral_source',
            'marketing_opt_in',
            'status',
            'notes',
            'rejection_reason',
            'rejected_at',
            'created_at',
            'approved_at',
        ]
        read_only_fields = fields


class RejectApplicationSerializer(serializers.Serializer):
    """Validates the rejection reason."""
    reason = serializers.CharField(required=False, allow_blank=True, default='')


class SetPasswordSerializer(serializers.Serializer):
    """Validates the set-password form submission."""
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)
    password_confirm = serializers.CharField(min_length=8)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'Passwords do not match.'}
            )
        return attrs
