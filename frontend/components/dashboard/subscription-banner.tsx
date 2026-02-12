"use client";

import Link from "next/link";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useContractStore } from "@/stores/contract-store";

export function SubscriptionBanner() {
  const status = useSubscriptionStore((s) => s.subscriptionStatus);
  const daysLeft = useSubscriptionStore((s) => s.trialDaysRemaining);
  const isExpired = useSubscriptionStore((s) => s.isTrialExpired);
  const loaded = useSubscriptionStore((s) => s.loaded);

  const contractStatus = useContractStore((s) => s.contractStatus);
  const contract = useContractStore((s) => s.contract);

  if (!loaded) return null;

  // Cancellation requested — amber banner with countdown
  if (contractStatus === "cancellation_requested" && contract?.service_end_date) {
    return (
      <div
        className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-[13px] font-medium text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Service ends on <strong>{new Date(contract.service_end_date).toLocaleDateString()}</strong>.
          {contract.days_until_service_end !== null && contract.days_until_service_end > 0 && (
            <> {contract.days_until_service_end} days remaining.</>
          )}
        </span>
        <Link
          href="/dashboard/contract"
          className="ml-1 underline underline-offset-2 hover:opacity-90 font-semibold"
        >
          View details
        </Link>
      </div>
    );
  }

  // Cancelled contract with read-only access — gray banner
  if (contractStatus === "cancelled" && contract?.read_only_access_until) {
    return (
      <div
        className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-[13px] font-medium text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #4b5563 0%, #6b7280 100%)" }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>
          Read-only access.
          {contract.days_until_access_expires !== null && contract.days_until_access_expires > 0 && (
            <> <strong>{contract.days_until_access_expires} days</strong> remaining.</>
          )}
          {" "}Download your data before access expires.
        </span>
        <Link
          href="/dashboard/contract"
          className="ml-1 underline underline-offset-2 hover:opacity-90 font-semibold"
        >
          Download data
        </Link>
      </div>
    );
  }

  // Active / paused users don't see a banner
  if (status === "active" || status === "paused") return null;

  // Trialing and NOT expired — info banner with countdown
  if (status === "trialing" && !isExpired) {
    return (
      <div
        className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-[13px] font-medium text-white shrink-0"
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #6366f1 100%)",
        }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          You have <strong>{daysLeft} day{daysLeft !== 1 ? "s" : ""}</strong> left in your free trial.
        </span>
        <Link
          href="/dashboard/subscription"
          className="ml-1 underline underline-offset-2 hover:opacity-90 font-semibold"
        >
          Upgrade now
        </Link>
      </div>
    );
  }

  // Past due — payment failed
  if (status === "past_due") {
    return (
      <div
        className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-[13px] font-medium text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span>
          Payment failed. You can view OTA bookings but all other services are suspended.
        </span>
        <Link
          href="/dashboard/subscription"
          className="ml-1 underline underline-offset-2 hover:opacity-90 font-semibold"
        >
          Update payment
        </Link>
      </div>
    );
  }

  // Cancelled (trial expired or cancelled subscription)
  if (status === "cancelled") {
    return (
      <div
        className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-[13px] font-medium text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span>
          Your trial has expired. Upgrade to continue using UnitoPMS.
        </span>
        <Link
          href="/dashboard/subscription"
          className="ml-1 underline underline-offset-2 hover:opacity-90 font-semibold"
        >
          Upgrade now
        </Link>
      </div>
    );
  }

  return null;
}
