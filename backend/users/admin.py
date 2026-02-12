from django.contrib import admin
from .models import CustomUser, HostProfile, Notification


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
