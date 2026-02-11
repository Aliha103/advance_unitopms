"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 flex-shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-900">UnitoPMS Admin</span>
      </div>

      {/* Right: user avatar + logout */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-gray-900">{user?.full_name || "Admin"}</p>
          <p className="text-[10px] text-gray-500">{user?.email}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
