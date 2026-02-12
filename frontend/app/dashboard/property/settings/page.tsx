"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

const PROPERTY_TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "boutique_hotel", label: "Boutique Hotel" },
  { value: "resort", label: "Resort" },
  { value: "motel", label: "Motel" },
  { value: "hostel", label: "Hostel" },
  { value: "bed_&_breakfast", label: "Bed & Breakfast" },
  { value: "vacation_rental", label: "Vacation Rental" },
  { value: "serviced_apartment", label: "Serviced Apartment" },
  { value: "apart-hotel", label: "Apart-Hotel" },
  { value: "villa", label: "Villa" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "lodge", label: "Lodge" },
  { value: "other", label: "Other" },
];

const BUSINESS_TYPES = [
  { value: "", label: "Select business type" },
  { value: "individual", label: "Individual" },
  { value: "sole_proprietor", label: "Sole Proprietor" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "non_profit", label: "Non-Profit" },
  { value: "other", label: "Other" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Rome", label: "Rome (CET)" },
  { value: "Europe/Madrid", label: "Madrid (CET)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
  { value: "Europe/Athens", label: "Athens (EET)" },
  { value: "Europe/Istanbul", label: "Istanbul (TRT)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Chicago", label: "Chicago (CST)" },
  { value: "America/Denver", label: "Denver (MST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "America/Sao_Paulo", label: "Sao Paulo (BRT)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Kolkata (IST)" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST)" },
];

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CHF", label: "CHF — Swiss Franc" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "JPY", label: "JPY — Japanese Yen" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "BRL", label: "BRL — Brazilian Real" },
  { value: "AED", label: "AED — UAE Dirham" },
  { value: "THB", label: "THB — Thai Baht" },
  { value: "MXN", label: "MXN — Mexican Peso" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "it", label: "Italiano" },
  { value: "es", label: "Espa\u00f1ol" },
  { value: "fr", label: "Fran\u00e7ais" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Portugu\u00eas" },
  { value: "nl", label: "Nederlands" },
  { value: "ja", label: "\u65e5\u672c\u8a9e" },
  { value: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" },
];

interface ProfileData {
  company_name: string;
  property_type: string;
  phone: string;
  website: string;
  business_type: string;
  legal_business_name: string;
  tax_id: string;
  vat_number: string;
  billing_email: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country_name: string;
  timezone: string;
  default_currency: string;
  preferred_language: string;
}

const INPUT_CLASS =
  "block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white";

export default function PropertySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProfileData>({
    company_name: "",
    property_type: "",
    phone: "",
    website: "",
    business_type: "",
    legal_business_name: "",
    tax_id: "",
    vat_number: "",
    billing_email: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state_province: "",
    postal_code: "",
    country_name: "",
    timezone: "UTC",
    default_currency: "EUR",
    preferred_language: "en",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<any>("/auth/profile/");
        setForm({
          company_name: data.company_name || "",
          property_type: data.property_type || "",
          phone: data.phone || "",
          website: data.website || "",
          business_type: data.business_type || "",
          legal_business_name: data.legal_business_name || "",
          tax_id: data.tax_id || "",
          vat_number: data.vat_number || "",
          billing_email: data.billing_email || "",
          address_line_1: data.address_line_1 || "",
          address_line_2: data.address_line_2 || "",
          city: data.city || "",
          state_province: data.state_province || "",
          postal_code: data.postal_code || "",
          country_name: data.country_name || "",
          timezone: data.timezone || "UTC",
          default_currency: data.default_currency || "EUR",
          preferred_language: data.preferred_language || "en",
        });
      } catch {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (field: keyof ProfileData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { country_name, ...editable } = form;
      await api.patch("/auth/profile/", editable);
      setSuccess("Settings saved successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/property" className="hover:text-teal-600 transition-colors">
          Property Settings
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">General Settings</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Property Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Basic property information, business details, and operational preferences.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
          {error}
          <button type="button" onClick={() => setError("")} className="ml-2 font-semibold underline">Dismiss</button>
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm border border-green-200">
          {success}
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* Property Identity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Property Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
              <input type="text" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="Grand Hotel & Spa" className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select value={form.property_type} onChange={(e) => update("property_type", e.target.value)} className={INPUT_CLASS}>
                <option value="" disabled>Select property type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+39 06 1234567" className={INPUT_CLASS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yourhotel.com" className={INPUT_CLASS} />
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Business Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select value={form.business_type} onChange={(e) => update("business_type", e.target.value)} className={INPUT_CLASS}>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal Business Name</label>
                <input type="text" value={form.legal_business_name} onChange={(e) => update("legal_business_name", e.target.value)} placeholder="Hotel Group S.r.l." className={INPUT_CLASS} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                <input type="text" value={form.tax_id} onChange={(e) => update("tax_id", e.target.value)} placeholder="IT12345678901" className={INPUT_CLASS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                <input type="text" value={form.vat_number} onChange={(e) => update("vat_number", e.target.value)} placeholder="IT12345678901" className={INPUT_CLASS} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Email</label>
              <input type="email" value={form.billing_email} onChange={(e) => update("billing_email", e.target.value)} placeholder="billing@yourhotel.com" className={INPUT_CLASS} />
            </div>
          </div>
        </div>

        {/* Property Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Property Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input type="text" value={form.address_line_1} onChange={(e) => update("address_line_1", e.target.value)} placeholder="Via Castellana 61" className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input type="text" value={form.address_line_2} onChange={(e) => update("address_line_2", e.target.value)} placeholder="Floor 2, Suite 3" className={INPUT_CLASS} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Venezia" className={INPUT_CLASS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                <input type="text" value={form.state_province} onChange={(e) => update("state_province", e.target.value)} placeholder="Veneto" className={INPUT_CLASS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input type="text" value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)} placeholder="30174" className={INPUT_CLASS} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" value={form.country_name} readOnly className="block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-500 bg-gray-50 cursor-not-allowed" />
              <p className="mt-1 text-xs text-gray-400">Country is set during registration and cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Operational Preferences */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Operational Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select value={form.timezone} onChange={(e) => update("timezone", e.target.value)} className={INPUT_CLASS}>
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select value={form.default_currency} onChange={(e) => update("default_currency", e.target.value)} className={INPUT_CLASS}>
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select value={form.preferred_language} onChange={(e) => update("preferred_language", e.target.value)} className={INPUT_CLASS}>
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
