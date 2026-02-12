"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface ProfileCompleteness {
  overall_percentage: number;
  total_fields: number;
  completed_fields: number;
  sections: Record<
    string,
    {
      label: string;
      fields: Record<string, boolean>;
      total: number;
      completed: number;
      percentage: number;
    }
  >;
}

interface HostDetail {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  company_name: string;
  country: string;
  country_name: string;
  phone: string;
  property_type: string;
  num_properties: number;
  num_units: number;
  referral_source: string;
  marketing_opt_in: boolean;
  business_type: string;
  legal_business_name: string;
  tax_id: string;
  vat_number: string;
  website: string;
  business_description: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_province: string;
  postal_code: string;
  timezone: string;
  default_currency: string;
  preferred_language: string;
  email_verified: boolean;
  phone_verified: boolean;
  identity_verified: boolean;
  identity_verified_at: string | null;
  terms_accepted_at: string | null;
  privacy_policy_accepted_at: string | null;
  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  billing_email: string;
  stripe_customer_id: string;
  status: string;
  onboarding_step: string;
  onboarding_completed_at: string | null;
  approved_at: string | null;
  approved_by_name: string;
  approved_by_email: string;
  suspended_at: string | null;
  suspension_reason: string;
  rejection_reason: string;
  rejected_at: string | null;
  rejected_by_name: string;
  rejected_by_email: string;
  profile_photo: string;
  bio: string;
  notes: string;
  profile_completeness: ProfileCompleteness;
  created_at: string;
  updated_at: string;
}

interface LogEntry {
  id: number;
  action: string;
  action_display: string;
  actor_name: string;
  actor_email: string;
  note: string;
  created_at: string;
}

interface ConversationItem {
  id: number;
  subject: string;
  status: string;
  host_company: string;
  host_email: string;
  last_message_at: string;
  unread_count: number;
  last_message_preview: string;
  created_at: string;
}

interface ContractInfo {
  id: number;
  version: string;
  status: string;
  signed_at: string | null;
  service_start_date: string | null;
  service_end_date: string | null;
  read_only_access_until: string | null;
  days_until_service_end: number | null;
  days_until_access_expires: number | null;
}

const LOG_ACTION_STYLES: Record<string, { color: string; bg: string }> = {
  approved: { color: "text-green-500", bg: "bg-green-400" },
  rejected: { color: "text-red-500", bg: "bg-red-400" },
  link_resent: { color: "text-blue-500", bg: "bg-blue-400" },
  password_set: { color: "text-teal-500", bg: "bg-teal-400" },
  note_added: { color: "text-gray-500", bg: "bg-gray-400" },
  status_changed: { color: "text-amber-500", bg: "bg-amber-400" },
  contract_signed: { color: "text-green-500", bg: "bg-green-400" },
  cancellation_requested: { color: "text-amber-500", bg: "bg-amber-400" },
  subscription_paid: { color: "text-green-500", bg: "bg-green-400" },
  email_sent: { color: "text-blue-500", bg: "bg-blue-400" },
  service_ended: { color: "text-gray-500", bg: "bg-gray-400" },
  access_expired: { color: "text-red-500", bg: "bg-red-400" },
};

/* ── Helpers ───────────────────────────────────────────────────────────────── */

const UNITS_RANGE_LABELS: Record<number, string> = {
  10: "1–10", 25: "11–25", 50: "26–50", 100: "51–100", 250: "101–250", 500: "250+",
};
function unitsRangeLabel(n: number): string {
  return UNITS_RANGE_LABELS[n] ?? String(n);
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  hotel: "Hotel", boutique_hotel: "Boutique Hotel", resort: "Resort", motel: "Motel",
  hostel: "Hostel", "bed_&_breakfast": "Bed & Breakfast", vacation_rental: "Vacation Rental",
  serviced_apartment: "Serviced Apartment", "apart-hotel": "Apart-Hotel", villa: "Villa",
  guesthouse: "Guesthouse", lodge: "Lodge", other: "Other",
};

const STATUS_STYLES: Record<string, string> = {
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-orange-50 text-orange-700 border-orange-200",
  deactivated: "bg-gray-50 text-gray-500 border-gray-200",
};

const FIELD_LABELS: Record<string, string> = {
  company_name: "Company Name", country: "Country", phone: "Phone",
  property_type: "Property Type", business_type: "Business Type",
  legal_business_name: "Legal Business Name", tax_id: "Tax ID",
  billing_email: "Billing Email", address_line_1: "Address Line 1",
  city: "City", state_province: "State / Province", postal_code: "Postal Code",
  business_description: "Description", bio: "Bio / Tagline",
  profile_photo: "Profile Photo", website: "Website",
  email_verified: "Email Verified", phone_verified: "Phone Verified",
  identity_verified: "Identity Verified", timezone: "Timezone",
  default_currency: "Currency", preferred_language: "Language",
};

const SECTION_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  registration: { bg: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-200" },
  business_info: { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200" },
  address: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200" },
  content: { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200" },
  verification: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  operational: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
};

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

const displayVal = (val: any) => {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
};

/* ── Page Component ────────────────────────────────────────────────────────── */

export default function HostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [host, setHost] = useState<HostDetail | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileData, logData] = await Promise.all([
          api.get<HostDetail>(`/auth/applications/${id}/profile/`),
          api.get<LogEntry[]>(`/auth/applications/${id}/logs/`),
        ]);
        setHost(profileData);
        setLogs(logData);

        // Fetch conversations (non-blocking)
        api.get<ConversationItem[]>(`/auth/applications/${id}/conversations/`)
          .then(setConversations)
          .catch(() => {});
      } catch (err: any) {
        setError(err.message || "Failed to load host profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !host) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
          {error || "Host not found."}
        </div>
        <button
          onClick={() => router.push("/dashboard/hosts")}
          className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          &larr; Back to Host Directory
        </button>
      </div>
    );
  }

  const comp = host.profile_completeness;
  const initials = host.full_name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const locationParts = [host.city, host.state_province, host.country_name].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : null;

  return (
    <div className="p-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/hosts" className="hover:text-teal-600 transition-colors">
          Host Directory
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{host.full_name}</span>
      </div>

      {/* ── Property Overview Hero ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="flex items-stretch">
          {/* Property Photo / Logo */}
          <div className="w-40 shrink-0 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center relative">
            {host.profile_photo ? (
              <img src={host.profile_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white/80">{initials}</span>
            )}
          </div>

          {/* Property Info */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">{host.company_name}</h1>
                  <span className={cn(
                    "inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full border capitalize",
                    STATUS_STYLES[host.status] || STATUS_STYLES.deactivated
                  )}>
                    {host.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{host.full_name} &middot; {host.email}</p>
                {locationStr && (
                  <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {locationStr}
                  </p>
                )}
              </div>
              <button
                onClick={() => router.push("/dashboard/hosts")}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
              </button>
            </div>

            {/* Property Quick Facts */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Type</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {PROPERTY_TYPE_LABELS[host.property_type] || host.property_type?.replace(/_/g, " ") || "—"}
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Properties</p>
                <p className="text-sm font-semibold text-gray-900">{host.num_properties}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Units</p>
                <p className="text-sm font-semibold text-gray-900">{unitsRangeLabel(host.num_units)}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Currency</p>
                <p className="text-sm font-semibold text-gray-900">{host.default_currency}</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Since</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(host.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Profile</p>
                <p className={cn(
                  "text-sm font-semibold",
                  comp.overall_percentage >= 80 ? "text-green-600" : comp.overall_percentage >= 50 ? "text-amber-600" : "text-red-500"
                )}>
                  {comp.overall_percentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Property Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label="Total Revenue" value="—" sub="No data yet" icon="revenue" />
        <StatCard label="Avg Monthly" value="—" sub="Revenue" icon="calendar" />
        <StatCard label="Total Bookings" value="—" sub="No data yet" icon="bookings" />
        <StatCard label="Avg Stay" value="—" sub="Length (nights)" icon="stay" />
        <StatCard label="Rating" value="—" sub="No reviews" icon="rating" />
        <StatCard label="Occupancy" value="—" sub="Rate" icon="occupancy" />
      </div>

      {/* ── Profile Completeness (collapsible) ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Profile Completeness</h2>
          <span className="text-lg font-bold text-gray-900">{comp.overall_percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${comp.overall_percentage}%`,
              background:
                comp.overall_percentage >= 80
                  ? "#10b981"
                  : comp.overall_percentage >= 50
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(comp.sections).map(([key, section]) => {
            const colors = SECTION_COLORS[key] || SECTION_COLORS.registration;
            const isExpanded = expandedSections.has(key);
            return (
              <div key={key}>
                <button
                  onClick={() => toggleSection(key)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    isExpanded
                      ? `${colors.bg} border-current/20`
                      : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                  )}
                >
                  <p className="text-xs font-medium text-gray-700 mb-1">{section.label}</p>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-xs font-bold",
                      section.percentage === 100 ? "text-green-600" : section.percentage > 0 ? "text-amber-600" : "text-red-500"
                    )}>
                      {section.completed}/{section.total}
                    </span>
                    <svg
                      className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", isExpanded && "rotate-180")}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>
                {isExpanded && (
                  <div className="mt-2 space-y-1 px-1">
                    {Object.entries(section.fields).map(([field, filled]) => (
                      <div key={field} className="flex items-center gap-2 text-xs">
                        {filled ? (
                          <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={filled ? "text-gray-700" : "text-gray-400"}>
                          {FIELD_LABELS[field] || field.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          {/* Registration */}
          <DetailCard title="Registration">
            <FieldGrid>
              <Field label="Company" value={host.company_name} />
              <Field label="Country" value={host.country_name} />
              <Field label="Phone" value={host.phone} />
              <Field label="Property Type" value={PROPERTY_TYPE_LABELS[host.property_type] || host.property_type?.replace(/_/g, " ")} />
              <Field label="Properties" value={host.num_properties} />
              <Field label="Units" value={unitsRangeLabel(host.num_units)} />
              <Field label="Referral Source" value={host.referral_source?.replace(/_/g, " ")} />
              <Field label="Marketing Opt-in" value={host.marketing_opt_in ? "Yes" : "No"} />
            </FieldGrid>
          </DetailCard>

          {/* Business Info */}
          <DetailCard title="Business Information">
            <FieldGrid>
              <Field label="Business Type" value={host.business_type?.replace(/_/g, " ")} />
              <Field label="Legal Name" value={host.legal_business_name} />
              <Field label="Tax ID" value={host.tax_id} />
              <Field label="VAT Number" value={host.vat_number} />
              <Field label="Website" value={host.website} />
              <Field label="Billing Email" value={host.billing_email} />
            </FieldGrid>
            {host.business_description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{host.business_description}</p>
              </div>
            )}
          </DetailCard>

          {/* Address */}
          <DetailCard title="Property Address">
            <FieldGrid>
              <Field label="Address Line 1" value={host.address_line_1} />
              <Field label="Address Line 2" value={host.address_line_2} />
              <Field label="City" value={host.city} />
              <Field label="State / Province" value={host.state_province} />
              <Field label="Postal Code" value={host.postal_code} />
              <Field label="Country" value={host.country_name} />
            </FieldGrid>
          </DetailCard>

          {/* Gallery & Branding */}
          <DetailCard title="Gallery & Branding">
            {/* Logo / Profile Photo */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Property Logo / Photo</p>
              {host.profile_photo ? (
                <img
                  src={host.profile_photo}
                  alt="Property"
                  className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Gallery placeholder */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Property Photos</p>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p className="text-sm text-gray-400">No photos uploaded yet</p>
                <p className="text-xs text-gray-300 mt-1">Gallery photos will appear here once uploaded by the host</p>
              </div>
            </div>

            {/* Bio & Description */}
            <FieldGrid>
              <Field label="Bio / Tagline" value={host.bio} />
              <Field label="Website" value={host.website} />
            </FieldGrid>
            {host.business_description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Business Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{host.business_description}</p>
              </div>
            )}
          </DetailCard>

          {/* Operational */}
          <DetailCard title="Operational Preferences">
            <FieldGrid>
              <Field label="Timezone" value={host.timezone} />
              <Field label="Currency" value={host.default_currency} />
              <Field label="Language" value={host.preferred_language} />
            </FieldGrid>
          </DetailCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Dates */}
          <DetailCard title="Status & Dates">
            <div className="space-y-3">
              <Field label="Status" value={host.status?.replace(/_/g, " ")} />
              <Field label="Onboarding Step" value={host.onboarding_step?.replace(/_/g, " ")} />
              <Field label="Account Active" value={host.is_active ? "Yes" : "No"} />
              <div className="border-t border-gray-100 pt-3 mt-3">
                <Field label="Created" value={formatDate(host.created_at)} />
                <Field label="Approved" value={formatDate(host.approved_at)} />
                {host.approved_by_name && <Field label="Approved By" value={host.approved_by_name} />}
              </div>
              {host.rejected_at && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <Field label="Rejected" value={formatDate(host.rejected_at)} />
                  {host.rejected_by_name && <Field label="Rejected By" value={host.rejected_by_name} />}
                  {host.rejection_reason && <Field label="Reason" value={host.rejection_reason} />}
                </div>
              )}
              {host.suspended_at && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <Field label="Suspended" value={formatDate(host.suspended_at)} />
                  {host.suspension_reason && <Field label="Reason" value={host.suspension_reason} />}
                </div>
              )}
            </div>
          </DetailCard>

          {/* Verification */}
          <DetailCard title="Verification">
            <div className="space-y-3">
              <VerifyField label="Email Verified" verified={host.email_verified} />
              <VerifyField label="Phone Verified" verified={host.phone_verified} />
              <VerifyField label="Identity Verified" verified={host.identity_verified} />
              {host.identity_verified_at && (
                <Field label="Verified At" value={formatDate(host.identity_verified_at)} />
              )}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <Field label="Terms Accepted" value={formatDate(host.terms_accepted_at)} />
                <Field label="Privacy Policy Accepted" value={formatDate(host.privacy_policy_accepted_at)} />
              </div>
            </div>
          </DetailCard>

          {/* Subscription */}
          <DetailCard title="Subscription">
            <div className="space-y-3">
              <Field label="Plan" value={host.subscription_plan?.replace(/_/g, " ")} />
              <Field label="Status" value={host.subscription_status} />
              <Field label="Trial Ends" value={formatDate(host.trial_ends_at)} />
              <Field label="Billing Email" value={host.billing_email} />
              <Field label="Stripe ID" value={host.stripe_customer_id} />
            </div>
          </DetailCard>

          {/* Admin Notes */}
          {host.notes && (
            <DetailCard title="Admin Notes">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{host.notes}</p>
            </DetailCard>
          )}

          {/* Messages */}
          <DetailCard title="Messages">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-400">No conversations yet.</p>
            ) : (
              <div className="space-y-2">
                {conversations.slice(0, 5).map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/dashboard/inbox?conversation=${conv.id}`}
                    className="block p-2.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{conv.subject}</p>
                      {conv.unread_count > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.last_message_preview}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                        conv.status === "open" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                      )}>
                        {conv.status}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(conv.last_message_at)}
                      </span>
                    </div>
                  </Link>
                ))}
                {conversations.length > 5 && (
                  <p className="text-xs text-gray-400 text-center pt-1">
                    +{conversations.length - 5} more conversations
                  </p>
                )}
              </div>
            )}
          </DetailCard>

          {/* Activity Log */}
          {logs.length > 0 && (
            <DetailCard title="Activity Log">
              <div className="space-y-3">
                {logs.map((log) => {
                  const style = LOG_ACTION_STYLES[log.action] || { color: "text-teal-500", bg: "bg-teal-400" };
                  return (
                    <div key={log.id} className="flex gap-3">
                      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", style.bg)} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{log.action_display}</p>
                        {log.note && <p className="text-xs text-gray-500 mt-0.5">{log.note}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {log.actor_name} &middot; {formatDate(log.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DetailCard>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shared Sub-components ─────────────────────────────────────────────────── */

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>;
}

function Field({ label, value }: { label: string; value: any }) {
  const display = displayVal(value);
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={cn("text-sm font-medium", display ? "text-gray-900" : "text-gray-400 italic")}>
        {display || "Not set"}
      </p>
    </div>
  );
}

function VerifyField({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      {verified ? (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Verified
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pending
        </span>
      )}
    </div>
  );
}

const STAT_ICONS: Record<string, string> = {
  revenue: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  calendar: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  bookings: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
  stay: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 6v6h4.5",
  rating: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  occupancy: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
};

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={STAT_ICONS[icon] || STAT_ICONS.revenue} />
        </svg>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
