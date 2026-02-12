"use client";

import { useState } from "react";
import { useSubscriptionStore } from "@/stores/subscription-store";

interface Channel {
  name: string;
  logo: string;
  color: string;
  connected: boolean;
}

export default function ChannelsPage() {
  const subscriptionStatus = useSubscriptionStore((s) => s.subscriptionStatus);
  const maxOta = useSubscriptionStore((s) => s.maxOtaConnections);

  const [channels, setChannels] = useState<Channel[]>([
    { name: "Booking.com", logo: "B", color: "bg-blue-600", connected: false },
    { name: "Airbnb", logo: "A", color: "bg-rose-500", connected: false },
    { name: "Expedia", logo: "E", color: "bg-yellow-500", connected: false },
    { name: "VRBO", logo: "V", color: "bg-indigo-600", connected: false },
    { name: "Google Hotels", logo: "G", color: "bg-green-500", connected: false },
    { name: "TripAdvisor", logo: "T", color: "bg-emerald-600", connected: false },
  ]);

  const connectedCount = channels.filter((c) => c.connected).length;
  const isTrial = subscriptionStatus === "trialing";
  const atTrialLimit = isTrial && connectedCount >= maxOta;

  const handleConnect = (name: string) => {
    if (atTrialLimit) return;
    setChannels((prev) =>
      prev.map((c) => (c.name === name ? { ...c, connected: true } : c))
    );
  };

  const handleDisconnect = (name: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.name === name ? { ...c, connected: false } : c))
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">OTA & Channels</h1>
        <p className="text-sm text-gray-500 mt-1">
          Connect and manage your distribution channels for synchronized availability and rates.
        </p>
      </div>

      {/* Trial limit banner */}
      {isTrial && (
        <div
          className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3 text-[13px]"
          style={{
            background: atTrialLimit
              ? "linear-gradient(135deg, #fef2f2, #fff1f2)"
              : "linear-gradient(135deg, #f0fdfa, #ecfeff)",
            border: atTrialLimit ? "1px solid #fecaca" : "1px solid #ccfbf1",
          }}
        >
          <svg className={`w-4 h-4 shrink-0 ${atTrialLimit ? "text-red-500" : "text-teal-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={atTrialLimit ? "text-red-700" : "text-teal-700"}>
            {atTrialLimit
              ? `You've reached the maximum of ${maxOta} OTA connections during your free trial. Upgrade to connect more channels.`
              : `Free trial allows up to ${maxOta} OTA connections. ${connectedCount}/${maxOta} used.`}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Connected", value: String(connectedCount), color: "text-green-600" },
          { label: "Available", value: String(channels.length) },
          { label: "Sync Status", value: connectedCount > 0 ? "Active" : "\u2014" },
          { label: "Last Sync", value: "\u2014" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color || "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Available Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((ch) => (
            <div key={ch.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 ${ch.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                {ch.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{ch.name}</p>
                <p className="text-xs text-gray-500">
                  {ch.connected ? "Connected" : "Not connected"}
                </p>
              </div>
              {ch.connected ? (
                <button
                  onClick={() => handleDisconnect(ch.name)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(ch.name)}
                  disabled={atTrialLimit}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    atTrialLimit
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-teal-600 bg-teal-50 hover:bg-teal-100"
                  }`}
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
