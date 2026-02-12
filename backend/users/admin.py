from django.contrib import admin
from .models import (
    CustomUser, HostProfile, Notification,
    ContractTemplate, ServiceContract, Conversation, Message,
)


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'is_host', 'is_active', 'is_staff')
    list_filter = ('is_host', 'is_active', 'is_staff')
    search_fields = ('email', 'full_name')


class HostProfileInline(admin.StackedInline):
    model = HostProfile
    can_delete = False
    fk_name = 'user'
    readonly_fields = ('created_at', 'updated_at')
    extra = 0


@admin.register(HostProfile)
class HostProfileAdmin(admin.ModelAdmin):
    list_display = (
        'company_name', 'user_email', 'status', 'property_type',
        'num_properties', 'num_units', 'subscription_plan', 'created_at',
    )
    list_filter = ('status', 'property_type', 'subscription_plan', 'subscription_status')
    search_fields = ('company_name', 'user__email', 'user__full_name', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('status',)

    fieldsets = (
        ('Host', {
            'fields': ('user', 'status', 'onboarding_step'),
        }),
        ('Registration Info', {
            'fields': (
                'company_name', 'country', 'country_name', 'phone',
                'property_type', 'num_properties', 'num_units',
                'referral_source', 'marketing_opt_in',
            ),
        }),
        ('Business Details', {
            'classes': ('collapse',),
            'fields': (
                'business_type', 'legal_business_name', 'tax_id',
                'vat_number', 'website', 'business_description',
            ),
        }),
        ('Address', {
            'classes': ('collapse',),
            'fields': (
                'address_line_1', 'address_line_2', 'city',
                'state_province', 'postal_code',
            ),
        }),
        ('Preferences', {
            'classes': ('collapse',),
            'fields': ('timezone', 'default_currency', 'preferred_language'),
        }),
        ('Verification', {
            'classes': ('collapse',),
            'fields': (
                'email_verified', 'phone_verified', 'identity_verified',
                'identity_verified_at', 'terms_accepted_at', 'privacy_policy_accepted_at',
            ),
        }),
        ('Subscription & Billing', {
            'classes': ('collapse',),
            'fields': (
                'subscription_plan', 'subscription_status', 'trial_ends_at',
                'billing_email', 'stripe_customer_id',
            ),
        }),
        ('Profile', {
            'classes': ('collapse',),
            'fields': ('profile_photo', 'bio', 'notes', 'metadata'),
        }),
        ('Approval', {
            'classes': ('collapse',),
            'fields': (
                'approved_at', 'approved_by',
                'suspended_at', 'suspension_reason',
            ),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )

    @admin.display(description='Email')
    def user_email(self, obj):
        return obj.user.email


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'is_read', 'created_at')
    list_filter = ('category', 'is_read')
    search_fields = ('title', 'user__email')
    readonly_fields = ('created_at',)


@admin.register(ContractTemplate)
class ContractTemplateAdmin(admin.ModelAdmin):
    list_display = ('title', 'version', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'version')
    readonly_fields = ('created_at',)


@admin.register(ServiceContract)
class ServiceContractAdmin(admin.ModelAdmin):
    list_display = ('host_profile', 'version', 'status', 'signed_at', 'service_end_date', 'read_only_access_until')
    list_filter = ('status',)
    search_fields = ('host_profile__company_name', 'host_profile__user__email')
    readonly_fields = ('created_at', 'updated_at')


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('sender', 'body', 'is_from_host', 'is_read', 'created_at')


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('subject', 'host', 'status', 'last_message_at', 'created_at')
    list_filter = ('status',)
    search_fields = ('subject', 'host__company_name', 'host__user__email')
    readonly_fields = ('created_at', 'last_message_at')
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'sender', 'is_from_host', 'is_read', 'created_at')
    list_filter = ('is_from_host', 'is_read')
    search_fields = ('body', 'conversation__subject')
    readonly_fields = ('created_at',)
