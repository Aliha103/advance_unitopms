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

/* ── Helpers ───────────────────────────────────────────────────────────────── */

const STATUS_STYLES: Record<string, string> = {
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-orange-50 text-orange-700 border-orange-200",
  deactivated: "bg-gray-50 text-gray-500 border-gray-200",
};

const FIELD_LABELS: Record<string, string> = {
  company_name: "Company Name",
  country: "Country",
  phone: "Phone",
  property_type: "Property Type",
  business_type: "Business Type",
  legal_business_name: "Legal Business Name",
  tax_id: "Tax ID",
  billing_email: "Billing Email",
  address_line_1: "Address Line 1",
  city: "City",
  state_province: "State / Province",
  postal_code: "Postal Code",
  business_description: "Description",
  bio: "Bio / Tagline",
  profile_photo: "Profile Photo",
  website: "Website",
  email_verified: "Email Verified",
  phone_verified: "Phone Verified",
  identity_verified: "Identity Verified",
  timezone: "Timezone",
  default_currency: "Currency",
  preferred_language: "Language",
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
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
            {host.profile_photo ? (
              <img src={host.profile_photo} alt="" className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{host.full_name}</h1>
            <p className="text-sm text-gray-500">{host.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={cn(
                  "inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize",
                  STATUS_STYLES[host.status] || STATUS_STYLES.deactivated
                )}
              >
                {host.status.replace(/_/g, " ")}
              </span>
              <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                {host.onboarding_step.replace(/_/g, " ")}
              </span>
            </div>
          </div>
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

      {/* Profile Completeness */}
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
                    <span
                      className={cn(
                        "text-xs font-bold",
                        section.percentage === 100
                          ? "text-green-600"
                          : section.percentage > 0
                          ? "text-amber-600"
                          : "text-red-500"
                      )}
                    >
                      {section.completed}/{section.total}
                    </span>
                    <svg
                      className={cn(
                        "w-3.5 h-3.5 text-gray-400 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
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

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          {/* Registration */}
          <DetailCard title="Registration">
            <FieldGrid>
              <Field label="Company" value={host.company_name} />
              <Field label="Country" value={host.country_name} />
              <Field label="Phone" value={host.phone} />
              <Field label="Property Type" value={host.property_type?.replace(/_/g, " ")} />
              <Field label="Properties" value={host.num_properties} />
              <Field label="Units" value={host.num_units} />
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

          {/* Content */}
          <DetailCard title="Content & Branding">
            {host.profile_photo && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Profile Photo</p>
                <img
                  src={host.profile_photo}
                  alt="Profile"
                  className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                />
              </div>
            )}
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
              <Field label="Plan" value={host.subscription_plan} />
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

          {/* Activity Log */}
          {logs.length > 0 && (
            <DetailCard title="Activity Log">
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{log.action_display}</p>
                      {log.note && <p className="text-xs text-gray-500 mt-0.5">{log.note}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {log.actor_name} &middot; {formatDate(log.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
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
