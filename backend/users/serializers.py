from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers

from .models import (
    HostProfile, ApplicationLog, ApplicationPermission, Notification,
    ContractTemplate, ServiceContract, Conversation, Message,
)

User = get_user_model()


def compute_profile_completeness(profile):
    """Compute profile completeness sections and overall percentage."""
    sections = {
        'registration': {
            'label': 'Registration',
            'fields': {
                'company_name': bool(profile.company_name),
                'country': bool(profile.country),
                'phone': bool(profile.phone),
                'property_type': bool(profile.property_type),
            },
        },
        'business_info': {
            'label': 'Business Information',
            'fields': {
                'business_type': bool(profile.business_type),
                'legal_business_name': bool(profile.legal_business_name),
                'tax_id': bool(profile.tax_id),
                'billing_email': bool(profile.billing_email),
            },
        },
        'address': {
            'label': 'Property Address',
            'fields': {
                'address_line_1': bool(profile.address_line_1),
                'city': bool(profile.city),
                'state_province': bool(profile.state_province),
                'postal_code': bool(profile.postal_code),
            },
        },
        'content': {
            'label': 'Content & Branding',
            'fields': {
                'business_description': bool(profile.business_description),
                'bio': bool(profile.bio),
                'profile_photo': bool(profile.profile_photo),
                'website': bool(profile.website),
            },
        },
        'verification': {
            'label': 'Verification',
            'fields': {
                'email_verified': profile.email_verified,
                'phone_verified': profile.phone_verified,
                'identity_verified': profile.identity_verified,
            },
        },
        'operational': {
            'label': 'Operational Settings',
            'fields': {
                'timezone': profile.timezone != 'UTC',
                'default_currency': profile.default_currency != 'USD',
                'preferred_language': profile.preferred_language != 'en',
            },
        },
    }

    total_fields = 0
    completed_fields = 0
    for section_data in sections.values():
        fields = section_data['fields']
        section_total = len(fields)
        section_completed = sum(1 for v in fields.values() if v)
        section_data['total'] = section_total
        section_data['completed'] = section_completed
        section_data['percentage'] = round(
            (section_completed / section_total * 100) if section_total else 0
        )
        total_fields += section_total
        completed_fields += section_completed

    return {
        'overall_percentage': round(
            (completed_fields / total_fields * 100) if total_fields else 0
        ),
        'total_fields': total_fields,
        'completed_fields': completed_fields,
        'sections': sections,
    }


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
    profile_completeness = serializers.SerializerMethodField()

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
            'referral_source',
            'marketing_opt_in',
            'email_verified',
            'phone_verified',
            'profile_photo',
            'bio',
            'created_at',
            # Business info
            'business_type',
            'legal_business_name',
            'tax_id',
            'vat_number',
            'website',
            'business_description',
            'billing_email',
            # Address
            'address_line_1',
            'address_line_2',
            'city',
            'state_province',
            'postal_code',
            # Completeness
            'profile_completeness',
        ]
        read_only_fields = fields

    def get_profile_completeness(self, obj):
        return compute_profile_completeness(obj)


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
    approved_by_name = serializers.CharField(
        source='approved_by.full_name', read_only=True, default=''
    )
    approved_by_email = serializers.EmailField(
        source='approved_by.email', read_only=True, default=''
    )
    rejected_by_name = serializers.CharField(
        source='rejected_by.full_name', read_only=True, default=''
    )
    rejected_by_email = serializers.EmailField(
        source='rejected_by.email', read_only=True, default=''
    )
    profile_completeness_pct = serializers.SerializerMethodField()

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
            'rejected_by_name',
            'rejected_by_email',
            'created_at',
            'approved_at',
            'approved_by_name',
            'approved_by_email',
            'profile_completeness_pct',
        ]
        read_only_fields = fields

    def get_profile_completeness_pct(self, obj):
        result = compute_profile_completeness(obj)
        return result['overall_percentage']


class HostProfileDetailSerializer(serializers.ModelSerializer):
    """Full read-only serializer for admin host detail view."""
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    approved_by_name = serializers.CharField(
        source='approved_by.full_name', read_only=True, default=''
    )
    approved_by_email = serializers.EmailField(
        source='approved_by.email', read_only=True, default=''
    )
    rejected_by_name = serializers.CharField(
        source='rejected_by.full_name', read_only=True, default=''
    )
    rejected_by_email = serializers.EmailField(
        source='rejected_by.email', read_only=True, default=''
    )
    profile_completeness = serializers.SerializerMethodField()

    class Meta:
        model = HostProfile
        fields = [
            # User-level
            'id', 'email', 'full_name', 'is_active',
            # Registration
            'company_name', 'country', 'country_name', 'phone',
            'property_type', 'num_properties', 'num_units',
            'referral_source', 'marketing_opt_in',
            # Business info
            'business_type', 'legal_business_name', 'tax_id',
            'vat_number', 'website', 'business_description',
            # Address
            'address_line_1', 'address_line_2', 'city',
            'state_province', 'postal_code',
            # Operational
            'timezone', 'default_currency', 'preferred_language',
            # Verification
            'email_verified', 'phone_verified', 'identity_verified',
            'identity_verified_at', 'terms_accepted_at',
            'privacy_policy_accepted_at',
            # Subscription
            'subscription_plan', 'subscription_status',
            'trial_ends_at', 'billing_email', 'stripe_customer_id',
            # Status/metadata
            'status', 'onboarding_step', 'onboarding_completed_at',
            'approved_at', 'approved_by_name', 'approved_by_email',
            'suspended_at', 'suspension_reason',
            'rejection_reason', 'rejected_at',
            'rejected_by_name', 'rejected_by_email',
            'profile_photo', 'bio', 'notes',
            # Computed
            'profile_completeness',
            # Timestamps
            'created_at', 'updated_at',
        ]
        read_only_fields = fields

    def get_profile_completeness(self, obj):
        return compute_profile_completeness(obj)


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


class ApplicationLogSerializer(serializers.ModelSerializer):
    """Read-only serializer for application activity logs."""
    actor_name = serializers.CharField(
        source='actor.full_name', read_only=True, default='System'
    )
    actor_email = serializers.EmailField(
        source='actor.email', read_only=True, default=''
    )
    action_display = serializers.CharField(
        source='get_action_display', read_only=True
    )

    class Meta:
        model = ApplicationLog
        fields = [
            'id',
            'action',
            'action_display',
            'actor_name',
            'actor_email',
            'note',
            'ip_address',
            'metadata',
            'created_at',
        ]
        read_only_fields = fields


class ApplicationPermissionSerializer(serializers.ModelSerializer):
    """Read-only serializer for listing permissions."""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(
        source='user.full_name', read_only=True, default=''
    )
    granted_by_email = serializers.EmailField(
        source='granted_by.email', read_only=True, default=''
    )
    permission_display = serializers.CharField(
        source='get_permission_display', read_only=True
    )

    class Meta:
        model = ApplicationPermission
        fields = [
            'id',
            'user',
            'user_email',
            'user_name',
            'permission',
            'permission_display',
            'granted_by',
            'granted_by_email',
            'created_at',
        ]
        read_only_fields = [
            'id', 'user_email', 'user_name', 'granted_by',
            'granted_by_email', 'permission_display', 'created_at',
        ]


class GrantPermissionSerializer(serializers.Serializer):
    """Validates granting a permission to a user."""
    user_id = serializers.IntegerField()
    permission = serializers.ChoiceField(
        choices=ApplicationPermission.Permission.choices
    )

    def validate_user_id(self, value):
        if not User.objects.filter(pk=value, is_staff=True).exists():
            raise serializers.ValidationError(
                'User not found or is not a staff member.'
            )
        return value


class SubscriptionStatusSerializer(serializers.Serializer):
    """Read-only serializer for host subscription status endpoint."""
    subscription_plan = serializers.CharField()
    subscription_status = serializers.CharField()
    trial_ends_at = serializers.DateTimeField()
    trial_days_remaining = serializers.IntegerField()
    is_trial_expired = serializers.BooleanField()
    is_portal_locked = serializers.BooleanField()
    max_ota_connections = serializers.IntegerField()


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for in-app notifications."""

    class Meta:
        model = Notification
        fields = [
            'id', 'category', 'title', 'message',
            'is_read', 'action_url', 'created_at',
        ]
        read_only_fields = fields


class AdminSubscriptionUpdateSerializer(serializers.Serializer):
    """Validates admin subscription update for a host."""
    subscription_plan = serializers.ChoiceField(
        choices=HostProfile.SubscriptionPlan.choices, required=False,
    )
    subscription_status = serializers.ChoiceField(
        choices=HostProfile.SubscriptionStatus.choices, required=False,
    )
    trial_ends_at = serializers.DateTimeField(required=False, allow_null=True)


# ── Contract serializers ─────────────────────────────────────

class ContractTemplateSerializer(serializers.ModelSerializer):
    """Read-only: returns the active contract template."""

    class Meta:
        model = ContractTemplate
        fields = ['id', 'version', 'title', 'body', 'created_at']
        read_only_fields = fields


class ServiceContractSerializer(serializers.ModelSerializer):
    """Read-only: host's own contract status with computed countdown fields."""
    days_until_service_end = serializers.IntegerField(read_only=True)
    days_until_access_expires = serializers.IntegerField(read_only=True)

    class Meta:
        model = ServiceContract
        fields = [
            'id', 'version', 'status', 'signed_at', 'service_start_date',
            'cancellation_requested_at', 'cancellation_notice_months',
            'service_end_date', 'read_only_access_until',
            'days_until_service_end', 'days_until_access_expires',
            'created_at', 'updated_at',
        ]
        read_only_fields = fields


class ContractSignSerializer(serializers.Serializer):
    """Validates the host clicking 'I Agree'."""
    agreement = serializers.BooleanField()

    def validate_agreement(self, value):
        if not value:
            raise serializers.ValidationError('You must agree to the contract.')
        return value


class CancellationRequestSerializer(serializers.Serializer):
    """Validates cancellation request with optional reason."""
    cancellation_reason = serializers.CharField(required=False, allow_blank=True, default='')


# ── Messaging serializers ────────────────────────────────────

class MessageSerializer(serializers.ModelSerializer):
    """Read-only message within a conversation."""
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'body', 'is_from_host', 'sender_name',
            'is_read', 'created_at',
        ]
        read_only_fields = fields

    def get_sender_name(self, obj):
        if obj.sender:
            return obj.sender.full_name or obj.sender.email
        return 'System'


class ConversationListSerializer(serializers.ModelSerializer):
    """Conversation list item with unread count and host info."""
    unread_count = serializers.SerializerMethodField()
    host_company = serializers.CharField(source='host.company_name', read_only=True)
    host_email = serializers.EmailField(source='host.user.email', read_only=True)
    last_message_preview = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'subject', 'status', 'host_company', 'host_email',
            'last_message_at', 'unread_count', 'last_message_preview',
            'created_at',
        ]
        read_only_fields = fields

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request:
            return 0
        if request.user.is_staff:
            return obj.messages.filter(is_from_host=True, is_read=False).count()
        return obj.messages.filter(is_from_host=False, is_read=False).count()

    def get_last_message_preview(self, obj):
        last = obj.messages.order_by('-created_at').first()
        if last:
            return last.body[:100]
        return ''


class ConversationDetailSerializer(serializers.ModelSerializer):
    """Full conversation with messages list."""
    messages = MessageSerializer(many=True, read_only=True)
    host_company = serializers.CharField(source='host.company_name', read_only=True)
    host_email = serializers.EmailField(source='host.user.email', read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'subject', 'status', 'host_company', 'host_email',
            'last_message_at', 'messages', 'created_at',
        ]
        read_only_fields = fields


class SendMessageSerializer(serializers.Serializer):
    """Validates sending a message in an existing conversation."""
    body = serializers.CharField()


class CreateConversationSerializer(serializers.Serializer):
    """Validates creating a new conversation with first message."""
    subject = serializers.CharField(max_length=255)
    body = serializers.CharField()
