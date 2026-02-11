"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface Application {
  id: number;
  email: string;
  full_name: string;
  company_name: string;
  country_name: string;
  phone: string;
  property_type: string;
  num_properties: number;
  num_units: number;
  status: string;
  rejection_reason: string;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
}

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending_review", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "active", label: "Active" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_STYLES: Record<string, string> = {
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-gray-50 text-gray-700 border-gray-200",
  deactivated: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Approve modal
  const [approveModal, setApproveModal] = useState<{
    open: boolean;
    app: Application | null;
    url: string | null;
  }>({ open: false, app: null, url: null });
  const [copied, setCopied] = useState(false);

  // Reject modal
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    app: Application | null;
  }>({ open: false, app: null });
  const [rejectReason, setRejectReason] = useState("");

  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = statusFilter
        ? `/auth/applications/?status=${statusFilter}`
        : "/auth/applications/";
      const data = await api.get<Application[]>(endpoint);
      setApplications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApprove = async (app: Application) => {
    setActionLoading(app.id);
    try {
      const res = await api.post<{
        message: string;
        set_password_url: string;
        email: string;
      }>(`/auth/applications/${app.id}/approve/`, {});
      setApproveModal({ open: true, app, url: res.set_password_url });
      fetchApplications();
    } catch (err: any) {
      setError(err.message || "Failed to approve.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.app) return;
    setActionLoading(rejectModal.app.id);
    try {
      await api.post(`/auth/applications/${rejectModal.app.id}/reject/`, {
        reason: rejectReason,
      });
      setRejectModal({ open: false, app: null });
      setRejectReason("");
      fetchApplications();
    } catch (err: any) {
      setError(err.message || "Failed to reject.");
    } finally {
      setActionLoading(null);
    }
  };

  const copyUrl = async () => {
    if (!approveModal.url) return;
    await navigator.clipboard.writeText(approveModal.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Host Applications
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage host registration applications.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              statusFilter === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
              />
            </svg>
            <p className="text-sm text-gray-500">No applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Applicant
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Company
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Property Type
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Units
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Applied
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {app.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">
                        {app.company_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.country_name}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-700 capitalize">
                        {app.property_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-700">
                        {app.num_properties} properties, {app.num_units} units
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500">
                        {formatDate(app.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize",
                          STATUS_STYLES[app.status] || STATUS_STYLES.deactivated
                        )}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(app.status === "pending_review" ||
                          app.status === "approved") && (
                          <button
                            type="button"
                            onClick={() => handleApprove(app)}
                            disabled={actionLoading === app.id}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {app.status === "approved"
                              ? "Resend Link"
                              : "Approve"}
                          </button>
                        )}
                        {app.status === "pending_review" && (
                          <button
                            type="button"
                            onClick={() =>
                              setRejectModal({ open: true, app })
                            }
                            disabled={actionLoading === app.id}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Approve Modal (shows set-password URL) ── */}
      {approveModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Application Approved
                </h3>
                <p className="text-sm text-gray-500">
                  {approveModal.app?.full_name} ({approveModal.app?.email})
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Copy the link below and send it to the host. They will use it to
              set their password and activate their account.
            </p>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <input
                type="text"
                readOnly
                value={approveModal.url || ""}
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
              />
              <button
                type="button"
                onClick={copyUrl}
                className={cn(
                  "shrink-0 px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                  copied
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              This link expires in 7 days.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setApproveModal({ open: false, app: null, url: null })
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Reject Application
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {rejectModal.app?.full_name} &mdash;{" "}
              {rejectModal.app?.company_name}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (optional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Provide a reason for rejection..."
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white resize-none"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectModal({ open: false, app: null });
                  setRejectReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading !== null}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
