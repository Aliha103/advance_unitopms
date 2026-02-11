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
  approved_by_name: string;
  approved_by_email: string;
  rejected_at: string | null;
  rejected_by_name: string;
  rejected_by_email: string;
}

interface LogEntry {
  id: number;
  action: string;
  action_display: string;
  actor_name: string;
  actor_email: string;
  note: string;
  ip_address: string | null;
  created_at: string;
}

interface Permission {
  id: number;
  user: number;
  user_email: string;
  user_name: string;
  permission: string;
  permission_display: string;
  granted_by_email: string;
  created_at: string;
}

interface StaffUser {
  id: number;
  email: string;
  full_name: string;
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

const LOG_ACTION_STYLES: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  link_resent: "bg-blue-100 text-blue-700",
  password_set: "bg-teal-100 text-teal-700",
  note_added: "bg-gray-100 text-gray-600",
  status_changed: "bg-indigo-100 text-indigo-700",
};

const PERM_OPTIONS = [
  { value: "view", label: "View", desc: "Can see applications list" },
  { value: "review", label: "Review", desc: "Can approve & reject" },
  { value: "manage", label: "Manage", desc: "Full control + permissions" },
];

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

  // Detail / Logs drawer
  const [detailDrawer, setDetailDrawer] = useState<{
    open: boolean;
    app: Application | null;
  }>({ open: false, app: null });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Permissions panel
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [permLoading, setPermLoading] = useState(false);
  const [grantUserId, setGrantUserId] = useState("");
  const [grantPerm, setGrantPerm] = useState("view");

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

  const openDetail = async (app: Application) => {
    setDetailDrawer({ open: true, app });
    setLogsLoading(true);
    try {
      const data = await api.get<LogEntry[]>(
        `/auth/applications/${app.id}/logs/`
      );
      setLogs(data);
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setPermLoading(true);
    try {
      const [perms, staff] = await Promise.all([
        api.get<Permission[]>("/auth/applications/permissions/"),
        api.get<StaffUser[]>("/auth/staff/"),
      ]);
      setPermissions(perms);
      setStaffList(staff);
    } catch {
      // Permission fetch failed — likely user doesn't have 'manage' permission
    } finally {
      setPermLoading(false);
    }
  };

  const handleGrantPermission = async () => {
    if (!grantUserId) return;
    try {
      await api.post("/auth/applications/permissions/grant/", {
        user_id: Number(grantUserId),
        permission: grantPerm,
      });
      setGrantUserId("");
      fetchPermissions();
    } catch (err: any) {
      setError(err.message || "Failed to grant permission.");
    }
  };

  const handleRevokePermission = async (permId: number) => {
    try {
      await api.delete(`/auth/applications/permissions/${permId}/`);
      fetchPermissions();
    } catch (err: any) {
      setError(err.message || "Failed to revoke permission.");
    }
  };

  const copyUrl = async () => {
    if (!approveModal.url) return;
    await navigator.clipboard.writeText(approveModal.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Host Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage host registration applications.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowPermissions(!showPermissions);
            if (!showPermissions) fetchPermissions();
          }}
          className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          Permissions
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
          {error}
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-2 font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Permissions Panel ── */}
      {showPermissions && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Application Permissions
          </h2>

          {permLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Grant form */}
              <div className="flex items-end gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Staff Member
                  </label>
                  <select
                    value={grantUserId}
                    onChange={(e) => setGrantUserId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">Select staff member...</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name || s.email} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-44">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Permission
                  </label>
                  <select
                    value={grantPerm}
                    onChange={(e) => setGrantPerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    {PERM_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label} — {p.desc}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleGrantPermission}
                  disabled={!grantUserId}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Grant
                </button>
              </div>

              {/* Current permissions */}
              {permissions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No permissions granted yet. Superusers have full access by
                  default.
                </p>
              ) : (
                <div className="space-y-2">
                  {permissions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                          {(p.user_name || p.user_email)[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {p.user_name || p.user_email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.user_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 text-xs font-semibold rounded-full",
                            p.permission === "manage"
                              ? "bg-purple-100 text-purple-700"
                              : p.permission === "review"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {p.permission_display}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRevokePermission(p.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
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
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => openDetail(app)}
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
                      {/* Show who approved/rejected inline */}
                      {app.status === "approved" && app.approved_by_name && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          by {app.approved_by_name}
                        </p>
                      )}
                      {app.status === "active" && app.approved_by_name && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          approved by {app.approved_by_name}
                        </p>
                      )}
                      {app.status === "rejected" && app.rejected_by_name && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          by {app.rejected_by_name}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
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

      {/* ── Detail / Activity Log Drawer ── */}
      {detailDrawer.open && detailDrawer.app && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div
            className="absolute inset-0"
            onClick={() => setDetailDrawer({ open: false, app: null })}
          />
          <div className="relative w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">
                Application Details
              </h2>
              <button
                type="button"
                onClick={() => setDetailDrawer({ open: false, app: null })}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile card */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                    {detailDrawer.app.full_name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {detailDrawer.app.full_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {detailDrawer.app.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 mb-0.5">Company</p>
                    <p className="text-gray-700 font-medium">
                      {detailDrawer.app.company_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Location</p>
                    <p className="text-gray-700 font-medium">
                      {detailDrawer.app.country_name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Property Type</p>
                    <p className="text-gray-700 font-medium capitalize">
                      {detailDrawer.app.property_type.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Portfolio</p>
                    <p className="text-gray-700 font-medium">
                      {detailDrawer.app.num_properties} props /{" "}
                      {detailDrawer.app.num_units} units
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Phone</p>
                    <p className="text-gray-700 font-medium">
                      {detailDrawer.app.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Applied</p>
                    <p className="text-gray-700 font-medium">
                      {formatDate(detailDrawer.app.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status + Actor */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize",
                      STATUS_STYLES[detailDrawer.app.status] ||
                        STATUS_STYLES.deactivated
                    )}
                  >
                    {detailDrawer.app.status.replace(/_/g, " ")}
                  </span>
                </div>

                {(detailDrawer.app.status === "approved" ||
                  detailDrawer.app.status === "active") &&
                  detailDrawer.app.approved_by_name && (
                    <div className="flex items-start gap-2 text-xs text-gray-600 mb-2">
                      <svg
                        className="w-4 h-4 text-green-500 shrink-0 mt-0.5"
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
                      <div>
                        <p>
                          Approved by{" "}
                          <span className="font-semibold text-gray-900">
                            {detailDrawer.app.approved_by_name}
                          </span>{" "}
                          ({detailDrawer.app.approved_by_email})
                        </p>
                        {detailDrawer.app.approved_at && (
                          <p className="text-gray-400">
                            {formatDateTime(detailDrawer.app.approved_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {detailDrawer.app.status === "rejected" &&
                  detailDrawer.app.rejected_by_name && (
                    <div className="flex items-start gap-2 text-xs text-gray-600 mb-2">
                      <svg
                        className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <div>
                        <p>
                          Rejected by{" "}
                          <span className="font-semibold text-gray-900">
                            {detailDrawer.app.rejected_by_name}
                          </span>{" "}
                          ({detailDrawer.app.rejected_by_email})
                        </p>
                        {detailDrawer.app.rejected_at && (
                          <p className="text-gray-400">
                            {formatDateTime(detailDrawer.app.rejected_at)}
                          </p>
                        )}
                        {detailDrawer.app.rejection_reason && (
                          <p className="mt-1 text-gray-600 bg-red-50 px-2 py-1 rounded">
                            Reason: {detailDrawer.app.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Activity Log */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Activity Log
                </h3>
                {logsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : logs.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">
                    No activity recorded yet.
                  </p>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-3 relative">
                          <div
                            className={cn(
                              "w-[31px] h-[31px] rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold",
                              LOG_ACTION_STYLES[log.action] ||
                                "bg-gray-100 text-gray-600"
                            )}
                          >
                            {log.action === "approved" && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            )}
                            {log.action === "rejected" && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {log.action === "link_resent" && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.06a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" /></svg>
                            )}
                            {log.action === "password_set" && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                            )}
                            {!["approved", "rejected", "link_resent", "password_set"].includes(log.action) && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {log.action_display}
                            </p>
                            <p className="text-xs text-gray-500">
                              {log.actor_name}{" "}
                              {log.actor_email && (
                                <span className="text-gray-400">
                                  ({log.actor_email})
                                </span>
                              )}
                            </p>
                            {log.note && (
                              <p className="text-xs text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded">
                                {log.note}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-[10px] text-gray-400">
                                {formatDateTime(log.created_at)}
                              </p>
                              {log.ip_address && (
                                <p className="text-[10px] text-gray-400 font-mono">
                                  {log.ip_address}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
