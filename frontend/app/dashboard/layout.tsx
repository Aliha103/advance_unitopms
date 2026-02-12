"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useContractStore } from "@/stores/contract-store";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { HostSidebar } from "@/components/dashboard/host-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { SubscriptionBanner } from "@/components/dashboard/subscription-banner";
import { PortalLockdownOverlay } from "@/components/dashboard/portal-lockdown-overlay";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isHost = user?.is_host ?? false;
  const isPortalLocked = useSubscriptionStore((s) => s.isPortalLocked);
  const fetchSubscription = useSubscriptionStore((s) => s.fetch);
  const contractStatus = useContractStore((s) => s.contractStatus);
  const contractLoaded = useContractStore((s) => s.loaded);
  const fetchContract = useContractStore((s) => s.fetchContract);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  // Fetch subscription status + contract status for host users
  useEffect(() => {
    if (mounted && isAuthenticated && isHost) {
      fetchSubscription();
      fetchContract();
    }
  }, [mounted, isAuthenticated, isHost, fetchSubscription, fetchContract]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Contract signing gate for hosts
  const needsContractSigning =
    isHost &&
    contractLoaded &&
    (contractStatus === "no_contract" || contractStatus === "pending") &&
    pathname !== "/dashboard/contract";

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Subscription banner for hosts */}
      {isHost && <SubscriptionBanner />}

      {/* Topbar — sticky, self-contained */}
      <DashboardTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out
            lg:relative lg:translate-x-0 lg:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {isHost ? <HostSidebar /> : <AdminSidebar />}
        </div>

        {/* Main content with optional lockdown overlay */}
        <div className="relative flex-1 overflow-y-auto">
          <main>{children}</main>
          {isHost && isPortalLocked && <PortalLockdownOverlay />}

          {/* Contract signing overlay */}
          {needsContractSigning && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/90 backdrop-blur-sm">
              <div className="text-center max-w-md px-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "linear-gradient(135deg, #0d9488, #0891b2)",
                    boxShadow: "0 8px 24px rgba(13,148,136,0.3)",
                  }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Sign Your Service Agreement</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Before you can use the UnitoPMS portal, you need to review and sign
                  our service agreement. This only takes a moment.
                </p>
                <Link
                  href="/dashboard/contract"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all"
                  style={{
                    background: "linear-gradient(135deg, #0d9488, #0891b2)",
                    boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
                  }}
                >
                  Review & Sign Contract
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
