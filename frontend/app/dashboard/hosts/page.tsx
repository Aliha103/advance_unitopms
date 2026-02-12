"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface Host {
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
  created_at: string;
  approved_at: string | null;
  profile_completeness_pct: number;
}

const UNITS_RANGE_LABELS: Record<number, string> = {
  10: "1–10", 25: "11–25", 50: "26–50", 100: "51–100", 250: "101–250", 500: "250+",
};
function unitsRangeLabel(n: number): string {
  return UNITS_RANGE_LABELS[n] ?? String(n);
}

const STATUS_STYLES: Record<string, string> = {
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-orange-50 text-orange-700 border-orange-200",
  deactivated: "bg-gray-50 text-gray-500 border-gray-200",
};

function HostsDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFromUrl = searchParams.get("status");

  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusFromUrl || "");
  const [search, setSearch] = useState("");

  // Determine page title/subtitle based on status filter
  const isSuspendedView = statusFromUrl === "suspended";

  const STATUS_TABS = isSuspendedView
    ? [] // No tabs for suspended view — single focus
    : [
        { key: "", label: "All Hosts" },
        { key: "active", label: "Active" },
        { key: "approved", label: "Approved" },
        { key: "suspended", label: "Suspended" },
        { key: "deactivated", label: "Deactivated" },
      ];

  const fetchHosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all host profiles — filter out pending_review and rejected (those are in Applications)
      const filter = statusFilter || statusFromUrl;
      const endpoint = filter
        ? `/auth/applications/?status=${filter}`
        : "/auth/applications/";
      const data = await api.get<Host[]>(endpoint);
      // For the directory view (no URL status), exclude pending_review and rejected
      if (!statusFromUrl && !statusFilter) {
        setHosts(
          data.filter(
            (h) => h.status !== "pending_review" && h.status !== "rejected"
          )
        );
      } else {
        setHosts(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load hosts.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, statusFromUrl]);

  useEffect(() => {
    fetchHosts();
  }, [fetchHosts]);

  const filteredHosts = search
    ? hosts.filter(
        (h) =>
          h.full_name.toLowerCase().includes(search.toLowerCase()) ||
          h.email.toLowerCase().includes(search.toLowerCase()) ||
          h.company_name.toLowerCase().includes(search.toLowerCase())
      )
    : hosts;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const avgCompleteness = hosts.length
    ? Math.round(
        hosts.reduce((s, h) => s + (h.profile_completeness_pct || 0), 0) /
          hosts.length
      )
    : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isSuspendedView ? "Suspended Hosts" : "Host Directory"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isSuspendedView
            ? "Hosts whose accounts have been suspended."
            : "All registered hosts on the platform."}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hosts..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
          />
        </div>

        {/* Status tabs */}
        {STATUS_TABS.length > 0 && (
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  statusFilter === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: "Total Hosts",
            value: hosts.length,
            suffix: "",
            color: "text-gray-900",
          },
          {
            label: "Active",
            value: hosts.filter((h) => h.status === "active").length,
            suffix: "",
            color: "text-green-600",
          },
          {
            label: "Approved",
            value: hosts.filter((h) => h.status === "approved").length,
            suffix: "",
            color: "text-blue-600",
          },
          {
            label: "Suspended",
            value: hosts.filter((h) => h.status === "suspended").length,
            suffix: "",
            color: "text-orange-600",
          },
          {
            label: "Avg. Profile",
            value: avgCompleteness,
            suffix: "%",
            color: "text-indigo-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 px-4 py-3"
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={cn("text-xl font-bold mt-1", stat.color)}>
              {stat.value}{stat.suffix}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredHosts.length === 0 ? (
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
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <p className="text-sm text-gray-500">No hosts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Host
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Company
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Property Type
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Properties
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Joined
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Profile
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHosts.map((host) => (
                  <tr
                    key={host.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/hosts/${host.id}`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {host.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {host.full_name}
                          </p>
                          <p className="text-xs text-gray-500">{host.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-900">
                        {host.company_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {host.country_name}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-700 capitalize">
                        {host.property_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-700">
                        {host.num_properties}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        ({unitsRangeLabel(host.num_units)} units)
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500">
                        {formatDate(host.approved_at || host.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${host.profile_completeness_pct || 0}%`,
                              background:
                                (host.profile_completeness_pct || 0) >= 80
                                  ? "#10b981"
                                  : (host.profile_completeness_pct || 0) >= 50
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {host.profile_completeness_pct || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize",
                          STATUS_STYLES[host.status] ||
                            STATUS_STYLES.deactivated
                        )}
                      >
                        {host.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HostsDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HostsDirectoryContent />
    </Suspense>
  );
}
