from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    is_host = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class HostProfile(models.Model):
    """
    Comprehensive host/property-manager profile.
    Created when a host application is submitted; linked 1:1 to CustomUser.
    Field set informed by Guesty, Hostaway, Cloudbeds, Lodgify, Airbnb, and
    Stripe Connect industry standards.
    """

    # ── Choices ──────────────────────────────────────────────

    class Status(models.TextChoices):
        PENDING_REVIEW = 'pending_review', _('Pending Review')
        APPROVED = 'approved', _('Approved')
        ACTIVE = 'active', _('Active')
        SUSPENDED = 'suspended', _('Suspended')
        DEACTIVATED = 'deactivated', _('Deactivated')

    class OnboardingStep(models.TextChoices):
        REGISTERED = 'registered', _('Registered')
        EMAIL_VERIFIED = 'email_verified', _('Email Verified')
        PROFILE_COMPLETED = 'profile_completed', _('Profile Completed')
        PROPERTY_ADDED = 'property_added', _('Property Added')
        PAYMENT_CONFIGURED = 'payment_configured', _('Payment Configured')
        ONBOARDING_COMPLETE = 'onboarding_complete', _('Onboarding Complete')

    class SubscriptionPlan(models.TextChoices):
        FREE_TRIAL = 'free_trial', _('Free Trial')
        STARTER = 'starter', _('Starter')
        PROFESSIONAL = 'professional', _('Professional')
        ENTERPRISE = 'enterprise', _('Enterprise')

    class SubscriptionStatus(models.TextChoices):
        TRIALING = 'trialing', _('Trialing')
        ACTIVE = 'active', _('Active')
        PAST_DUE = 'past_due', _('Past Due')
        CANCELLED = 'cancelled', _('Cancelled')
        PAUSED = 'paused', _('Paused')

    class PropertyType(models.TextChoices):
        HOTEL = 'hotel', _('Hotel')
        BOUTIQUE_HOTEL = 'boutique_hotel', _('Boutique Hotel')
        RESORT = 'resort', _('Resort')
        MOTEL = 'motel', _('Motel')
        HOSTEL = 'hostel', _('Hostel')
        BED_AND_BREAKFAST = 'bed_&_breakfast', _('Bed & Breakfast')
        VACATION_RENTAL = 'vacation_rental', _('Vacation Rental')
        SERVICED_APARTMENT = 'serviced_apartment', _('Serviced Apartment')
        APART_HOTEL = 'apart-hotel', _('Apart-Hotel')
        VILLA = 'villa', _('Villa')
        GUESTHOUSE = 'guesthouse', _('Guesthouse')
        LODGE = 'lodge', _('Lodge')
        OTHER = 'other', _('Other')

    class BusinessType(models.TextChoices):
        INDIVIDUAL = 'individual', _('Individual')
        SOLE_PROPRIETOR = 'sole_proprietor', _('Sole Proprietor')
        PARTNERSHIP = 'partnership', _('Partnership')
        LLC = 'llc', _('LLC')
        CORPORATION = 'corporation', _('Corporation')
        NON_PROFIT = 'non_profit', _('Non-Profit')
        OTHER = 'other', _('Other')

    class ReferralSource(models.TextChoices):
        GOOGLE_SEARCH = 'google_search', _('Google Search')
        REFERRAL = 'referral_/_word_of_mouth', _('Referral / Word of Mouth')
        LINKEDIN = 'linkedin', _('LinkedIn')
        FACEBOOK = 'facebook_/_instagram', _('Facebook / Instagram')
        CONFERENCE = 'conference_/_trade_show', _('Conference / Trade Show')
        BLOG = 'blog_/_article', _('Blog / Article')
        CHANNEL_PARTNER = 'channel_partner', _('Channel Partner')
        OTHER = 'other', _('Other')

    # ── Relationships ────────────────────────────────────────

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='host_profile',
    )

    # ── Registration fields (collected at sign-up) ───────────

    company_name = models.CharField(max_length=255)
    country = models.CharField(max_length=2, help_text='ISO 3166-1 alpha-2')
    country_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30)
    property_type = models.CharField(max_length=30, choices=PropertyType.choices)
    num_properties = models.PositiveIntegerField()
    num_units = models.PositiveIntegerField()
    referral_source = models.CharField(max_length=50, choices=ReferralSource.choices, blank=True)
    marketing_opt_in = models.BooleanField(default=False)

    # ── Business info (Phase 2 — profile completion) ─────────

    business_type = models.CharField(
        max_length=20, choices=BusinessType.choices, blank=True,
    )
    legal_business_name = models.CharField(max_length=255, blank=True)
    tax_id = models.CharField(max_length=50, blank=True)
    vat_number = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    business_description = models.TextField(blank=True)

    # ── Address ──────────────────────────────────────────────

    address_line_1 = models.CharField(max_length=255, blank=True)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state_province = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)

    # ── Operational preferences ──────────────────────────────

    timezone = models.CharField(max_length=50, default='UTC')
    default_currency = models.CharField(max_length=3, default='USD')
    preferred_language = models.CharField(max_length=10, default='en')

    # ── Verification / compliance ────────────────────────────

    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    identity_verified = models.BooleanField(default=False)
    identity_verified_at = models.DateTimeField(null=True, blank=True)
    terms_accepted_at = models.DateTimeField(null=True, blank=True)
    privacy_policy_accepted_at = models.DateTimeField(null=True, blank=True)

    # ── Subscription / billing ───────────────────────────────

    subscription_plan = models.CharField(
        max_length=20,
        choices=SubscriptionPlan.choices,
        default=SubscriptionPlan.FREE_TRIAL,
    )
    subscription_status = models.CharField(
        max_length=20,
        choices=SubscriptionStatus.choices,
        default=SubscriptionStatus.TRIALING,
    )
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    billing_email = models.EmailField(blank=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True)

    # ── Profile metadata ─────────────────────────────────────

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING_REVIEW,
    )
    onboarding_step = models.CharField(
        max_length=30,
        choices=OnboardingStep.choices,
        default=OnboardingStep.REGISTERED,
    )
    onboarding_completed_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='approved_hosts',
    )
    suspended_at = models.DateTimeField(null=True, blank=True)
    suspension_reason = models.TextField(blank=True)
    profile_photo = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    notes = models.TextField(blank=True, help_text='Internal admin notes')
    metadata = models.JSONField(default=dict, blank=True)

    # ── Timestamps ───────────────────────────────────────────

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Host Profile'
        verbose_name_plural = 'Host Profiles'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.company_name} ({self.user.email})'
