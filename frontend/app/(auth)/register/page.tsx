"use client";

/**
 * Host Application / Register Page — "/register"
 *
 * Multi-step application form ported from Leptos/Rust.
 * Steps: 1) Account → 2) Business → 3) Properties
 * On success shows confetti + confirmation message.
 */
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { api } from "@/lib/api-client";
import { COUNTRIES, CountrySelectWithSearch } from "@/components/ui/countries";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // Step 2
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  // Step 3
  const [propertyType, setPropertyType] = useState("");
  const [numProperties, setNumProperties] = useState("");
  const [numUnits, setNumUnits] = useState("");
  const [referral, setReferral] = useState("");
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!firstName || !lastName) { setError("Please enter your full name"); return; }
      if (!email || !email.includes("@")) { setError("Please enter a valid email address"); return; }
    }
    if (step === 2) {
      if (!company) { setError("Please enter your business / property name"); return; }
      if (!country) { setError("Please select your country"); return; }
      if (!phone) { setError("Please enter your mobile number"); return; }
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!terms) { setError("You must agree to the Terms of Service and Privacy Policy"); return; }
    if (!propertyType) { setError("Please select your property type"); return; }
    if (numProperties === "" || numProperties == null) { setError("Please select number of properties"); return; }
    if (numUnits === "" || numUnits == null) { setError("Please select total rooms/units"); return; }
    if (!referral) { setError("Please tell us how you heard about UnitoPMS"); return; }

    const numPropsInt = typeof numProperties === "string" ? parseInt(numProperties, 10) : numProperties;
    const numUnitsInt = typeof numUnits === "string" ? parseInt(numUnits, 10) : numUnits;
    if (Number.isNaN(numPropsInt) || numPropsInt <= 0) {
      setError("Please select number of properties");
      return;
    }
    if (Number.isNaN(numUnitsInt) || numUnitsInt <= 0) {
      setError("Please select total rooms/units");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/auth/host-application/", {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company_name: company,
        country,
        country_name: COUNTRIES.find((c) => c.code === country)?.name ?? country,
        property_type: propertyType,
        num_properties: numPropsInt,
        num_units: numUnitsInt,
        referral_source: referral,
        marketing_opt_in: Boolean(marketing),
      });
      setIsSuccess(true);
    } catch (err:any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mb-6 animate-bounce">
            <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Application Received!</h3>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Thank you for applying. We will review your application and contact you at{" "}
            <span className="font-semibold text-gray-900">{email}</span> within 24 hours.
          </p>
          <Link
            href="/"
            className="inline-block text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2 pt-20 overflow-hidden">
      <Navbar />

      {/* Left Panel — Branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-center px-12 pt-8 relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            {["GDPR Compliant", "SSL Secured"].map((badge) => (
              <div key={badge} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">{badge}</span>
              </div>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            The Property Management Platform Built for{" "}
            <span className="text-teal-400">Growth</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Join 2,500+ hospitality professionals who trust UnitoPMS to manage
            their operations, maximize revenue, and deliver exceptional guest experiences.
          </p>

          <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 mb-8">
            {[["2,500+","Active Properties"],["98%","Customer Satisfaction"],["35%","Avg. Revenue Increase"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-teal-400">{v}</div>
                <div className="text-xs text-gray-400 mt-1">{l}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              ["Enterprise-Grade Security","Bank-level encryption, SOC 2 compliance, and automated backups.","M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"],
              ["Go Live in 24 Hours","Dedicated onboarding specialist and free data migration.","M13 10V3L4 14h7v7l9-11h-7z"],
              ["24/7 Priority Support","Real humans, not bots. Average response time under 2 minutes.","M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"],
            ].map(([title, desc, icon]) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-col justify-start px-4 sm:px-6 lg:px-16 xl:px-20 py-8 overflow-y-auto h-full">
        {/* Spacer for fixed navbar */}
        <div className="h-0 lg:h-20 shrink-0"></div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Host Application</h2>
            <p className="mt-1 text-sm text-gray-500">
              Apply to manage your properties with UnitoPMS. Our team will review
              and contact you within 24 hours.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s, i) => (
                <div key={s} className="flex items-center">
                  {i > 0 && (
                    <div className={`flex-1 h-0.5 mx-3 w-16 ${step > s - 1 ? "bg-teal-500" : "bg-gray-200"}`} />
                  )}
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        step >= s ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step > s ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s
                      )}
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600 hidden sm:block">
                      {["Account", "Business", "Properties"][s - 1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@yourhotel.com" className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
                  <p className="mt-1 text-xs text-gray-500">We&apos;ll send your account credentials after approval</p>
                </div>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                  <p className="text-sm text-teal-800">
                    <strong>No password needed now</strong> — After we review your
                    application, we&apos;ll send you secure login credentials.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Business */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business / Property Name</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Grand Hotel & Spa" className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <CountrySelectWithSearch
                    value={country}
                    onChange={(code) => setCountry(code)}
                    placeholder="Select your country"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
                </div>
              </div>
            )}

            {/* Step 3: Properties */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type <span className="text-red-500">*</span></label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white">
                    <option value="" disabled>Select property type</option>
                    {["Hotel","Boutique Hotel","Resort","Motel","Hostel","Bed & Breakfast","Vacation Rental","Serviced Apartment","Apart-Hotel","Villa","Guesthouse","Lodge","Other"].map((t) => <option key={t} value={t.toLowerCase().replace(/ /g,"_")}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Properties <span className="text-red-500">*</span></label>
                  <select value={numProperties} onChange={(e) => setNumProperties(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white">
                    <option value="" disabled>Select</option>
                    {[
                      { label: "1 property", value: 1 },
                      { label: "2–5", value: 5 },
                      { label: "6–10", value: 10 },
                      { label: "11–25", value: 25 },
                      { label: "26–50", value: 50 },
                      { label: "50+", value: 100 },
                    ].map(({ label, value }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">How many separate properties do you manage?</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms / Units <span className="text-red-500">*</span></label>
                  <select value={numUnits} onChange={(e) => setNumUnits(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white">
                    <option value="" disabled>Select</option>
                    {[
                      { label: "1–10 units", value: 10 },
                      { label: "11–25 units", value: 25 },
                      { label: "26–50 units", value: 50 },
                      { label: "51–100 units", value: 100 },
                      { label: "101–250 units", value: 250 },
                      { label: "250+ units", value: 500 },
                    ].map(({ label, value }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Total bookable units across all properties. A full apartment listed as one unit on OTAs = 1 unit. Individual rooms listed separately = count each room.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                  <select value={referral} onChange={(e) => setReferral(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white">
                    <option value="" disabled>Select</option>
                    {["Google Search","Referral / Word of Mouth","LinkedIn","Facebook / Instagram","Conference / Trade Show","Blog / Article","Channel Partner","Other"].map((v) => <option key={v} value={v.toLowerCase().replace(/ /g,"_")}>{v}</option>)}
                  </select>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start">
                    <input type="checkbox" id="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the <a href="/terms" className="text-teal-600 hover:text-teal-500 font-medium">Terms of Service</a> and <a href="/privacy" className="text-teal-600 hover:text-teal-500 font-medium">Privacy Policy</a>
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input type="checkbox" id="marketing" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    <label htmlFor="marketing" className="ml-2 text-sm text-gray-600">
                      Send me product updates and hospitality industry insights
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <button type="button" onClick={() => { setError(""); setStep((s) => s - 1); }} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Back
                </button>
              )}
              {step < 3 && (
                <button type="button" onClick={nextStep} className="flex-1 py-2.5 px-4 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Continue
                </button>
              )}
              {step === 3 && (
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Submitting..." : "Start Free Trial"}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-teal-600 hover:text-teal-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
