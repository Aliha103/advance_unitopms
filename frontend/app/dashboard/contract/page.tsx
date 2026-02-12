"use client";

import { useState, useEffect } from "react";
import { useContractStore } from "@/stores/contract-store";

export default function ContractPage() {
  const template = useContractStore((s) => s.template);
  const contract = useContractStore((s) => s.contract);
  const contractStatus = useContractStore((s) => s.contractStatus);
  const loaded = useContractStore((s) => s.loaded);
  const signing = useContractStore((s) => s.signing);
  const cancelling = useContractStore((s) => s.cancelling);
  const fetchTemplate = useContractStore((s) => s.fetchTemplate);
  const fetchContract = useContractStore((s) => s.fetchContract);
  const signContract = useContractStore((s) => s.signContract);
  const requestCancellation = useContractStore((s) => s.requestCancellation);

  const [cancelReason, setCancelReason] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchTemplate();
    fetchContract();
  }, [fetchTemplate, fetchContract]);

  const handleSign = async () => {
    try {
      await signContract();
    } catch {
      // Error handled in store
    }
  };

  const handleCancel = async () => {
    try {
      await requestCancellation(cancelReason);
      setShowCancelConfirm(false);
      setCancelReason("");
    } catch {
      // Error handled in store
    }
  };

  const handleExport = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/auth/contract/export/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "unitopms-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Error
    } finally {
      setDownloading(false);
    }
  };

  if (!loaded) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No contract signed — show template to sign
  if (contractStatus === "no_contract" || contractStatus === "pending") {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service Agreement</h1>
          <p className="text-sm text-gray-500 mt-1">
            Please review and sign the service agreement to continue using UnitoPMS.
          </p>
        </div>

        {template ? (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">{template.title}</h2>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  v{template.version}
                </span>
              </div>
              <div
                className="max-h-[500px] overflow-y-auto pr-2 text-sm text-gray-700 leading-relaxed prose prose-sm"
                dangerouslySetInnerHTML={{ __html: template.body }}
              />
            </div>

            <div
              className="rounded-xl p-6"
              style={{
                background: "linear-gradient(135deg, #f0fdfa, #ecfeff)",
                border: "1px solid #ccfbf1",
              }}
            >
              <p className="text-sm text-gray-700 mb-4">
                By clicking &quot;I Agree & Sign&quot;, you confirm that you have read, understood, and agree
                to the terms of the UnitoPMS Service Agreement.
              </p>
              <button
                onClick={handleSign}
                disabled={signing}
                className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #0d9488, #0891b2)",
                  boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
                }}
              >
                {signing ? "Signing..." : "I Agree & Sign"}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">
              No active contract template is available. Please contact support.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Contract signed — show status
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Agreement</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your contract status and service details.
        </p>
      </div>

      {/* Contract status card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contract Status</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {contractStatus === "active" && "Active"}
              {contractStatus === "cancellation_requested" && "Cancellation Requested"}
              {contractStatus === "cancelled" && "Service Ended"}
              {contractStatus === "expired" && "Expired"}
            </p>
            {contract?.signed_at && (
              <p className="text-xs text-gray-500 mt-1">
                Signed on {new Date(contract.signed_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              contractStatus === "active"
                ? "bg-green-50 text-green-700"
                : contractStatus === "cancellation_requested"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {contractStatus === "active" && "Active"}
            {contractStatus === "cancellation_requested" && "Notice Period"}
            {contractStatus === "cancelled" && "Read-Only"}
            {contractStatus === "expired" && "Expired"}
          </span>
        </div>

        {/* Important dates */}
        {(contract?.service_end_date || contract?.read_only_access_until) && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {contract.service_end_date && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400">Service End Date</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {new Date(contract.service_end_date).toLocaleDateString()}
                </p>
                {contract.days_until_service_end !== null && contract.days_until_service_end > 0 && (
                  <p className="text-xs text-amber-600 mt-0.5">
                    {contract.days_until_service_end} days remaining
                  </p>
                )}
              </div>
            )}
            {contract.read_only_access_until && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400">Read-Only Access Until</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {new Date(contract.read_only_access_until).toLocaleDateString()}
                </p>
                {contract.days_until_access_expires !== null && contract.days_until_access_expires > 0 && (
                  <p className="text-xs text-red-600 mt-0.5">
                    {contract.days_until_access_expires} days remaining
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cancelled warning */}
        {(contractStatus === "cancelled" || contractStatus === "cancellation_requested") && (
          <div
            className="mt-4 px-4 py-3 rounded-xl flex items-center gap-3 text-[13px]"
            style={{
              background:
                contractStatus === "cancelled"
                  ? "linear-gradient(135deg, #f3f4f6, #f9fafb)"
                  : "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border:
                contractStatus === "cancelled"
                  ? "1px solid #e5e7eb"
                  : "1px solid #fde68a",
            }}
          >
            <svg
              className={`w-5 h-5 shrink-0 ${contractStatus === "cancelled" ? "text-gray-500" : "text-amber-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className={`font-semibold ${contractStatus === "cancelled" ? "text-gray-700" : "text-amber-800"}`}>
                {contractStatus === "cancelled"
                  ? "Your service has ended. Portal is read-only."
                  : "Cancellation in progress"}
              </p>
              <p className={`mt-0.5 ${contractStatus === "cancelled" ? "text-gray-500" : "text-amber-600"}`}>
                {contractStatus === "cancelled"
                  ? "You can view past bookings and records but cannot make changes. Download your data before access expires."
                  : `Your service will end on ${contract?.service_end_date ? new Date(contract.service_end_date).toLocaleDateString() : "N/A"}. After that, you'll have 365 days of read-only access.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Download data button — always available */}
        <button
          onClick={handleExport}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {downloading ? "Downloading..." : "Download My Data"}
        </button>

        {/* Cancel service button — only for active contracts */}
        {contractStatus === "active" && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Request Cancellation
          </button>
        )}
      </div>

      {/* Cancellation confirmation modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-900">Cancel Service?</h3>
            <p className="text-sm text-gray-600 mt-2">
              This will begin a 2-month notice period. After that, your service will end
              and you will have 365 days of read-only access.
            </p>
            <div className="mt-4">
              <label className="text-xs font-medium text-gray-500">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300"
                rows={3}
                placeholder="Let us know why you're leaving..."
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Service
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
