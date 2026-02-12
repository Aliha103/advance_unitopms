"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

const INPUT_CLASS =
  "block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white";

export default function PropertyContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<any>("/auth/profile/");
        setCompanyName(data.company_name || "");
        setDescription(data.business_description || "");
        setBio(data.bio || "");
        setProfilePhoto(data.profile_photo || "");
      } catch {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.patch("/auth/profile/", {
        company_name: companyName,
        business_description: description,
        bio,
        profile_photo: profilePhoto,
      });
      setSuccess("Content saved successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save content.");
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
        <span className="text-gray-900 font-medium">Content</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your property&apos;s public-facing content and visual identity.
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
        {/* Public Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Public Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Public Display Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="All'Arco Apartment" className={INPUT_CLASS} />
              <p className="mt-1 text-xs text-gray-400">This name is shown to guests on your booking page and OTA listings.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe your property, its unique features, location highlights, and what makes it special for guests..."
                className={INPUT_CLASS + " resize-none"}
              />
              <p className="mt-1 text-xs text-gray-400">{description.length}/2000 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Tagline</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="A charming apartment in the heart of Venice, steps from St. Mark's Square."
                className={INPUT_CLASS + " resize-none"}
              />
              <p className="mt-1 text-xs text-gray-400">A brief tagline that appears in search results and summaries.</p>
            </div>
          </div>
        </div>

        {/* Visual Identity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Visual Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Logo / Photo URL</label>
              <input type="url" value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} placeholder="https://example.com/logo.png" className={INPUT_CLASS} />
              {profilePhoto && (
                <div className="mt-3 w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                  <img src={profilePhoto} alt="Property logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>

            {/* Gallery placeholder */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Property Images</p>
                  <p className="text-xs text-gray-500">Upload and manage property photos from the Gallery page.</p>
                </div>
                <Link href="/dashboard/gallery" className="px-3 py-1.5 text-xs font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                  Go to Gallery
                </Link>
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
