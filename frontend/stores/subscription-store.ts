import { create } from "zustand";
import { api } from "@/lib/api-client";

interface SubscriptionState {
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  isPortalLocked: boolean;
  maxOtaConnections: number;
  loaded: boolean;
  fetch: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptionPlan: "free_trial",
  subscriptionStatus: "trialing",
  trialEndsAt: null,
  trialDaysRemaining: 14,
  isTrialExpired: false,
  isPortalLocked: false,
  maxOtaConnections: 2,
  loaded: false,

  fetch: async () => {
    try {
      const data = await api.get<{
        subscription_plan: string;
        subscription_status: string;
        trial_ends_at: string | null;
        trial_days_remaining: number;
        is_trial_expired: boolean;
        is_portal_locked: boolean;
        max_ota_connections: number;
      }>("/auth/subscription-status/");

      set({
        subscriptionPlan: data.subscription_plan,
        subscriptionStatus: data.subscription_status,
        trialEndsAt: data.trial_ends_at,
        trialDaysRemaining: data.trial_days_remaining,
        isTrialExpired: data.is_trial_expired,
        isPortalLocked: data.is_portal_locked,
        maxOtaConnections: data.max_ota_connections,
        loaded: true,
      });
    } catch {
      // Non-host users or network error — keep defaults
      set({ loaded: true });
    }
  },
}));
