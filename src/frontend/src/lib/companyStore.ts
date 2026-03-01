// Local store for company settings (persisted in localStorage as fallback)

export interface CompanySettings {
  name: string;
  logoUrl: string;
  whatsapp: string;
  email: string;
  instagram: string;
  twitter: string;
  facebook: string;
  address: string;
  phone: string;
  website: string;
}

const STORAGE_KEY = "memorable_holidays_company";

const defaultSettings: CompanySettings = {
  name: "Memorable Holidays",
  logoUrl: "",
  whatsapp: "",
  email: "",
  instagram: "",
  twitter: "",
  facebook: "",
  address: "",
  phone: "",
  website: "",
};

export const companyStore = {
  get: (): CompanySettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {}
    return { ...defaultSettings };
  },
  set: (settings: Partial<CompanySettings>) => {
    try {
      const current = companyStore.get();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {}
    return defaultSettings;
  },
};
