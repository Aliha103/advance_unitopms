import { create } from "zustand";
import { api } from "@/lib/api-client";

interface ContractTemplate {
  id: number;
  version: string;
  title: string;
  body: string;
  created_at: string;
}

interface ContractStatus {
  id: number;
  version: string;
  status: string;
  signed_at: string | null;
  service_start_date: string | null;
  cancellation_requested_at: string | null;
  cancellation_notice_months: number;
  service_end_date: string | null;
  read_only_access_until: string | null;
  days_until_service_end: number | null;
  days_until_access_expires: number | null;
  created_at: string;
  updated_at: string;
}

interface ContractState {
  template: ContractTemplate | null;
  contract: ContractStatus | null;
  contractStatus: string; // 'no_contract' | 'pending' | 'active' | 'cancellation_requested' | 'cancelled' | 'expired'
  loaded: boolean;
  signing: boolean;
  cancelling: boolean;

  fetchTemplate: () => Promise<void>;
  fetchContract: () => Promise<void>;
  signContract: () => Promise<void>;
  requestCancellation: (reason?: string) => Promise<void>;
}

export const useContractStore = create<ContractState>((set, get) => ({
  template: null,
  contract: null,
  contractStatus: "no_contract",
  loaded: false,
  signing: false,
  cancelling: false,

  fetchTemplate: async () => {
    try {
      const data = await api.get<ContractTemplate>("/auth/contract-template/");
      set({ template: data });
    } catch {
      // No active template
    }
  },

  fetchContract: async () => {
    try {
      const data = await api.get<ContractStatus | { status: string }>("/auth/contract/");
      if ("status" in data && !("id" in data)) {
        set({ contractStatus: data.status, contract: null, loaded: true });
      } else {
        const contract = data as ContractStatus;
        set({ contract, contractStatus: contract.status, loaded: true });
      }
    } catch {
      set({ contractStatus: "no_contract", loaded: true });
    }
  },

  signContract: async () => {
    set({ signing: true });
    try {
      const data = await api.post<ContractStatus>("/auth/contract/sign/", {
        agreement: true,
      });
      set({ contract: data, contractStatus: data.status, signing: false });
    } catch {
      set({ signing: false });
      throw new Error("Failed to sign contract");
    }
  },

  requestCancellation: async (reason?: string) => {
    set({ cancelling: true });
    try {
      const data = await api.post<ContractStatus>("/auth/contract/cancel/", {
        cancellation_reason: reason || "",
      });
      set({ contract: data, contractStatus: data.status, cancelling: false });
    } catch {
      set({ cancelling: false });
      throw new Error("Failed to request cancellation");
    }
  },
}));
