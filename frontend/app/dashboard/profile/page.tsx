"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

interface HostProfile {
  id: number;
  email: string;
  full_name: string;
  company_name: string;
  country: string;
  country_name: string;
  phone: string;
  property_type: string;
  num_properties: number;
  num_units: number;
  status: string;
  onboarding_step: string;
  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  timezone: string;
  default_currency: string;
  preferred_language: string;
  email_verified: boolean;
  phone_verified: boolean;
  profile_photo: string;
  bio: string;
  created_at: string;
  business_type: string;
  legal_business_name: string;
  tax_id: string;
  vat_number: string;
  website: string;
  business_description: string;
  billing_email: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_province: string;
  postal_code: string;
  profile_completeness: ProfileCompleteness;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

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

const SECTION_EDIT_LINKS: Record<string, string | null> = {
  registration: "/dashboard/property/settings",
  business_info: "/dashboard/property/settings",
  address: "/dashboard/property/settings",
  content: "/dashboard/property/content",
  verification: null, // system-managed
  operational: "/dashboard/property/settings",
};

const SECTION_COLORS: Record<string, { bg: string; border: string }> = {
  registration: { bg: "bg-teal-50", border: "border-teal-200" },
  business_info: { bg: "bg-indigo-50", border: "border-indigo-200" },
  address: { bg: "bg-sky-50", border: "border-sky-200" },
  content: { bg: "bg-violet-50", border: "border-violet-200" },
  verification: { bg: "bg-emerald-50", border: "border-emerald-200" },
  operational: { bg: "bg-amber-50", border: "border-amber-200" },
};

const displayVal = (key: string, profile: HostProfile): string | null => {
  const val = (profile as any)[key];
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val).replace(/_/g, " ");
};

/* ── Page Component ────────────────────────────────────────────────────────── */

export default function MyProfilePage() {
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<HostProfile>("/auth/profile/");
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
          {error || "Unable to load profile."}
        </div>
      </div>
    );
  }

  const comp = profile.profile_completeness;

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your property profile and setup completeness.
        </p>
      </div>

      {/* Completeness Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Profile Completeness</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {comp.completed_fields} of {comp.total_fields} fields completed
            </p>
          </div>
          <span
            className={cn(
              "text-2xl font-bold",
              comp.overall_percentage >= 80
                ? "text-green-600"
                : comp.overall_percentage >= 50
                ? "text-amber-600"
                : "text-red-500"
            )}
          >
            {comp.overall_percentage}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${comp.overall_percentage}%`,
              background:
                comp.overall_percentage >= 80
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : comp.overall_percentage >= 50
                  ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                  : "linear-gradient(90deg, #ef4444, #f87171)",
            }}
          />
        </div>
        {comp.overall_percentage < 100 && (
          <p className="text-xs text-gray-500 mt-2">
            Complete your profile to improve visibility and unlock all features.
          </p>
        )}
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(comp.sections).map(([key, section]) => {
          const editLink = SECTION_EDIT_LINKS[key];
          const colors = SECTION_COLORS[key] || SECTION_COLORS.registration;

          return (
            <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Section Header */}
              <div className={cn("px-5 py-3 flex items-center justify-between", colors.bg)}>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{section.label}</h3>
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 text-xs font-bold rounded-full",
                      section.percentage === 100
                        ? "bg-green-100 text-green-700"
                        : section.percentage > 0
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-600"
                    )}
                  >
                    {section.completed}/{section.total}
                  </span>
                </div>
                {editLink && (
                  <Link
                    href={editLink}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    Edit
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Field List */}
              <div className="px-5 py-3 space-y-2">
                {Object.entries(section.fields).map(([field, filled]) => {
                  const value = displayVal(field, profile);
                  return (
                    <div key={field} className="flex items-start gap-2.5">
                      {filled ? (
                        <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-gray-500">
                          {FIELD_LABELS[field] || field.replace(/_/g, " ")}
                        </span>
                        {filled && value ? (
                          <p className="text-sm font-medium text-gray-900 truncate capitalize">
                            {value}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Not set</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
