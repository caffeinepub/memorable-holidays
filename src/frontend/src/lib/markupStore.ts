// ── Markup Store ─────────────────────────────────────────────────────────────
// Stores markup rules and applied markups in localStorage.
// Markup details are NEVER shown in guest-facing bill/print views.
// Only admin and staff can see markup breakdown.

export type MarkupAppliesTo =
  | "all"
  | "hotel"
  | "activities"
  | "food"
  | "transport"
  | "boating"
  | "custom";

export type MarkupType = "percentage" | "fixed";

export interface MarkupRule {
  id: string;
  name: string;
  type: MarkupType;
  value: number; // percentage (e.g. 15 = 15%) or fixed amount in INR
  appliesTo: MarkupAppliesTo;
  notes: string;
  isActive: boolean;
  createdAt: string;
}

// An applied markup links a rule to a specific booking/package/invoice
export interface AppliedMarkup {
  id: string;
  ruleId: string;
  ruleName: string;
  ruleType: MarkupType;
  ruleValue: number;
  baseAmount: number; // the amount the markup was applied on
  markupAmount: number; // computed markup in INR
  entityType: "package" | "invoice" | "booking" | "quote";
  entityId: string; // packageId, invoiceId, etc.
  appliedBy: string; // admin display name
  appliedAt: string;
  notes: string;
}

const RULES_KEY = "mh_markup_rules";
const APPLIED_KEY = "mh_applied_markups";

// ── Persistence helpers ──────────────────────────────────────────────────────

function loadRules(): MarkupRule[] {
  try {
    const s = localStorage.getItem(RULES_KEY);
    return s ? (JSON.parse(s) as MarkupRule[]) : [];
  } catch {
    return [];
  }
}

function saveRules(rules: MarkupRule[]): void {
  try {
    localStorage.setItem(RULES_KEY, JSON.stringify(rules));
  } catch {}
}

function loadApplied(): AppliedMarkup[] {
  try {
    const s = localStorage.getItem(APPLIED_KEY);
    return s ? (JSON.parse(s) as AppliedMarkup[]) : [];
  } catch {
    return [];
  }
}

function saveApplied(applied: AppliedMarkup[]): void {
  try {
    localStorage.setItem(APPLIED_KEY, JSON.stringify(applied));
  } catch {}
}

// ── Store API ────────────────────────────────────────────────────────────────

export const markupStore = {
  // ── Rules ──────────────────────────────────────────────────────────────────

  getRules(): MarkupRule[] {
    return loadRules();
  },

  addRule(rule: Omit<MarkupRule, "id" | "createdAt" | "isActive">): MarkupRule {
    const rules = loadRules();
    const newRule: MarkupRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    rules.push(newRule);
    saveRules(rules);
    return newRule;
  },

  updateRule(id: string, updates: Partial<Omit<MarkupRule, "id">>): void {
    const rules = loadRules().map((r) =>
      r.id === id ? { ...r, ...updates } : r,
    );
    saveRules(rules);
  },

  deleteRule(id: string): void {
    saveRules(loadRules().filter((r) => r.id !== id));
    // Also remove applied markups that referenced this rule
    saveApplied(loadApplied().filter((a) => a.ruleId !== id));
  },

  toggleRule(id: string): void {
    const rules = loadRules().map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r,
    );
    saveRules(rules);
  },

  // ── Applied Markups ────────────────────────────────────────────────────────

  getApplied(): AppliedMarkup[] {
    return loadApplied();
  },

  getAppliedForEntity(
    entityType: AppliedMarkup["entityType"],
    entityId: string,
  ): AppliedMarkup[] {
    return loadApplied().filter(
      (a) => a.entityType === entityType && a.entityId === entityId,
    );
  },

  applyMarkup(
    rule: MarkupRule,
    baseAmount: number,
    entityType: AppliedMarkup["entityType"],
    entityId: string,
    appliedBy: string,
    notes = "",
  ): AppliedMarkup {
    const markupAmount =
      rule.type === "percentage"
        ? Math.round((baseAmount * rule.value) / 100)
        : rule.value;

    const applied: AppliedMarkup = {
      id: `am_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      ruleType: rule.type,
      ruleValue: rule.value,
      baseAmount,
      markupAmount,
      entityType,
      entityId,
      appliedBy,
      appliedAt: new Date().toISOString(),
      notes,
    };

    const existing = loadApplied();
    existing.push(applied);
    saveApplied(existing);
    return applied;
  },

  removeApplied(id: string): void {
    saveApplied(loadApplied().filter((a) => a.id !== id));
  },

  // ── Computed ───────────────────────────────────────────────────────────────

  /** Total markup amount for a specific entity */
  getTotalMarkupForEntity(
    entityType: AppliedMarkup["entityType"],
    entityId: string,
  ): number {
    return this.getAppliedForEntity(entityType, entityId).reduce(
      (sum, a) => sum + a.markupAmount,
      0,
    );
  },
};

// ── Label helpers ─────────────────────────────────────────────────────────────

export const MARKUP_APPLIES_TO_LABELS: Record<MarkupAppliesTo, string> = {
  all: "All Bookings",
  hotel: "Hotel Only",
  activities: "Activities Only",
  food: "Food Only",
  transport: "Transport Only",
  boating: "Boating Only",
  custom: "Custom / Other",
};

export const MARKUP_TYPE_LABELS: Record<MarkupType, string> = {
  percentage: "Percentage (%)",
  fixed: "Fixed Amount (₹)",
};
