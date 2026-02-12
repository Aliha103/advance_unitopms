import { create } from "zustand";

interface User {
  id: number;
  email: string;
  full_name: string;
  is_host: boolean;
}

interface HostProfile {
  id: number;
  company_name: string;
  status: string;
  onboarding_step: string;
  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  property_type: string;
  num_properties: number;
  num_units: number;
  referral_source: string;
  marketing_opt_in: boolean;
  // Profile fields returned by HostProfileSerializer
  email?: string;
  full_name?: string;
  country?: string;
  country_name?: string;
  phone?: string;
  timezone?: string;
  default_currency?: string;
  preferred_language?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  profile_photo?: string;
  bio?: string;
  created_at?: string;
  // Business fields (editable post-onboarding)
  business_type?: string;
  legal_business_name?: string;
  tax_id?: string;
  vat_number?: string;
  website?: string;
  business_description?: string;
  billing_email?: string;
  // Address fields
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
}

interface AuthState {
  user: User | null;
  hostProfile: HostProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (payload: {
    user: User;
    host_profile?: HostProfile;
    access: string;
    refresh: string;
  }) => void;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hostProfile: null,
  accessToken: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("access_token") : false,

  login: ({ user, host_profile, access, refresh }) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    set({
      user,
      hostProfile: host_profile ?? null,
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({
      user: null,
      hostProfile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setTokens: (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    set({ accessToken: access, refreshToken: refresh });
  },
}));
