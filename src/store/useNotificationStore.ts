import { create } from "zustand";

type NotificationPermissionState = NotificationPermission | "unsupported";
type DeviceTokenStatus =
  | "idle"
  | "registering"
  | "registered"
  | "failed"
  | "unregistered";

interface NotificationState {
  permission: NotificationPermissionState;
  tokenStatus: DeviceTokenStatus;
  tokenRegistered: boolean;
  lastError: string | null;
  setPermission: (permission: NotificationPermissionState) => void;
  setTokenStatus: (status: DeviceTokenStatus) => void;
  setTokenRegistered: (registered: boolean) => void;
  setLastError: (error: string | null) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  permission: "default",
  tokenStatus: "idle",
  tokenRegistered: false,
  lastError: null,
  setPermission: (permission) => set({ permission }),
  setTokenStatus: (tokenStatus) => set({ tokenStatus }),
  setTokenRegistered: (tokenRegistered) => set({ tokenRegistered }),
  setLastError: (lastError) => set({ lastError }),
}));
