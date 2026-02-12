"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
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

  // Fetch subscription status for host users
  useEffect(() => {
    if (mounted && isAuthenticated && isHost) {
      fetchSubscription();
    }
  }, [mounted, isAuthenticated, isHost, fetchSubscription]);

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
        </div>
      </div>
    </div>
  );
}
