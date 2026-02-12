"use client";

import { useState, useCallback } from "react";

export function PortalLockdownOverlay() {
  const [showToast, setShowToast] = useState(false);

  const handleClick = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  return (
    <>
      {/* Transparent overlay blocking all interactions in main content */}
      <div
        className="absolute inset-0 z-20 cursor-not-allowed"
        onClick={handleClick}
        style={{ background: "rgba(255,255,255,0.02)" }}
      />

      {/* Toast notification */}
      {showToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-[13px] font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
            boxShadow: "0 8px 24px rgba(220,38,38,0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Your account is suspended. Please upgrade or update payment to continue.
          </div>
        </div>
      )}
    </>
  );
}
