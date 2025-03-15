// ===== Available Modules =====
export const AVAILABLE_MODULES = {
  auth: "auth",
  email: "email",
} as const;

export type AvailableModule = keyof typeof AVAILABLE_MODULES;
export const availableModules = Object.keys(AVAILABLE_MODULES);

// ===== Module Implementations =====
export const MODULE_IMPLEMENTATIONS: Record<AvailableModule, string[]> = {
  auth: ["custom"],
  email: ["sendgrid"],
} as const;
