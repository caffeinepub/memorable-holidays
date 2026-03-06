import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Principal } from "@dfinity/principal";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit3,
  KeyRound,
  Loader2,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../../backend";
import type { CredentialAccount, UserPrivileges } from "../../backend.d.ts";
import { useActor } from "../../hooks/useActor";
import {
  useCreateCredentialUser,
  useDeleteCredentialUser,
  useGetUserPrivileges,
  useListCredentialUsers,
  useResetCredentialPassword,
  useSetUserPrivileges,
  useUpdateCredentialUser,
} from "../../hooks/useQueries";

// ── Password Hashing ─────────────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Privilege Module Config ───────────────────────────────────────────────────

type PrivilegeKey = keyof Omit<UserPrivileges, "accountId">;

const PRIVILEGE_MODULES: {
  key: PrivilegeKey;
  label: string;
  description: string;
}[] = [
  { key: "dashboard", label: "Dashboard", description: "Overview & stats" },
  {
    key: "newPackage",
    label: "New Package",
    description: "Create tour packages",
  },
  {
    key: "packagesLibrary",
    label: "Packages Library",
    description: "View & manage packages",
  },
  { key: "leads", label: "Leads", description: "CRM lead pipeline" },
  { key: "customers", label: "Customers", description: "Customer database" },
  { key: "bookings", label: "Bookings", description: "Booking management" },
  { key: "vendors", label: "Vendors", description: "Vendor directory" },
  { key: "reminders", label: "Reminders", description: "Task reminders" },
  { key: "invoices", label: "Invoices", description: "Invoice generation" },
  { key: "promotions", label: "Promotions", description: "Discount & offers" },
  { key: "analytics", label: "Analytics", description: "Reports & charts" },
  { key: "reviews", label: "Reviews", description: "Guest reviews" },
  {
    key: "companySettings",
    label: "Company Settings",
    description: "View company info",
  },
  {
    key: "rateManagement",
    label: "Rate Management",
    description: "View rate config",
  },
];

function buildDefaultPrivileges(accountId: bigint): UserPrivileges {
  return {
    accountId,
    dashboard: false,
    newPackage: false,
    packagesLibrary: false,
    leads: false,
    customers: false,
    bookings: false,
    vendors: false,
    reminders: false,
    invoices: false,
    promotions: false,
    analytics: false,
    reviews: false,
    companySettings: false,
    rateManagement: false,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface PrivilegePanelProps {
  account: CredentialAccount;
  onClose: () => void;
}

function PrivilegePanel({ account, onClose }: PrivilegePanelProps) {
  const { data: existingPrivileges, isLoading } = useGetUserPrivileges(
    account.id,
  );
  const setPrivileges = useSetUserPrivileges();
  const [privs, setPrivs] = useState<UserPrivileges | null>(null);

  useEffect(() => {
    if (existingPrivileges !== undefined) {
      setPrivs(existingPrivileges ?? buildDefaultPrivileges(account.id));
    }
  }, [existingPrivileges, account.id]);

  const handleToggle = (key: PrivilegeKey) => {
    setPrivs((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handleSave = async () => {
    if (!privs) return;
    try {
      await setPrivileges.mutateAsync(privs);
      toast.success(`Privileges saved for ${account.displayName}`);
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save privileges",
      );
    }
  };

  const handleSelectAll = () => {
    setPrivs((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      for (const { key } of PRIVILEGE_MODULES) {
        (updated as Record<string, unknown>)[key] = true;
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    setPrivs((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      for (const { key } of PRIVILEGE_MODULES) {
        (updated as Record<string, unknown>)[key] = false;
      }
      return updated;
    });
  };

  if (isLoading || !privs) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground">
            Module Access — {account.displayName}
          </h3>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Toggle which sections this {account.role} can access
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs text-teal hover:text-teal-dark h-7 px-2"
          >
            <Check className="w-3 h-3 mr-1" /> All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
          >
            <X className="w-3 h-3 mr-1" /> None
          </Button>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PRIVILEGE_MODULES.map(({ key, label, description }) => (
          <button
            key={key}
            type="button"
            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer text-left w-full ${
              privs[key]
                ? "bg-gold/5 border-gold/30"
                : "bg-muted/20 border-border/40 hover:border-border"
            }`}
            onClick={() => handleToggle(key)}
          >
            <div className="flex-1 min-w-0 mr-3">
              <p
                className={`text-xs font-medium font-sans leading-tight ${privs[key] ? "text-gold" : "text-foreground"}`}
              >
                {label}
              </p>
              <p className="text-[10px] text-muted-foreground font-sans leading-tight mt-0.5 truncate">
                {description}
              </p>
            </div>
            <Switch
              checked={privs[key]}
              onCheckedChange={() => handleToggle(key)}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-gold shrink-0"
            />
          </button>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex gap-2 pt-1">
        <Button
          onClick={handleSave}
          disabled={setPrivileges.isPending}
          className="flex-1 gradient-gold text-sidebar font-display font-semibold text-sm"
        >
          {setPrivileges.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-2" />
          )}
          Save Privileges
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-border/60 text-muted-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ── User Row ─────────────────────────────────────────────────────────────────

interface UserRowProps {
  account: CredentialAccount;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onChangePassword: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isTogglingActive: boolean;
}

function UserRow({
  account,
  isExpanded,
  onToggleExpand,
  onEdit,
  onChangePassword,
  onDelete,
  onToggleActive,
  isTogglingActive,
}: UserRowProps) {
  const roleColors: Record<string, string> = {
    CEO: "border-gold/50 text-gold bg-gold/10",
    Manager: "border-teal/50 text-teal bg-teal/10",
  };

  const formattedDate = new Date(
    Number(account.createdAt) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      {/* Row */}
      <div className="flex items-center gap-3 p-4 bg-card/50 hover:bg-card/80 transition-colors">
        {/* Expand toggle */}
        <button
          type="button"
          onClick={onToggleExpand}
          className="shrink-0 w-7 h-7 rounded-lg bg-muted/30 hover:bg-muted/60 flex items-center justify-center transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand privileges"}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="text-sm font-display font-bold text-primary">
            {account.displayName.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-sm text-foreground truncate">
              {account.displayName}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 h-4 shrink-0 ${roleColors[account.role] || "border-border text-muted-foreground"}`}
            >
              {account.role}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 h-4 shrink-0 ${
                account.isActive
                  ? "border-teal/40 text-teal bg-teal/5"
                  : "border-destructive/40 text-destructive/70 bg-destructive/5"
              }`}
            >
              {account.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-muted-foreground font-mono">
              @{account.username}
            </span>
            <span className="text-[10px] text-muted-foreground/60 font-sans">
              Created {formattedDate}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Active Toggle */}
          <button
            type="button"
            onClick={onToggleActive}
            disabled={isTogglingActive}
            title={account.isActive ? "Deactivate account" : "Activate account"}
            className={`h-7 px-2 rounded-lg text-xs font-sans border transition-colors ${
              account.isActive
                ? "border-destructive/30 text-destructive/70 hover:bg-destructive/10 hover:border-destructive/50"
                : "border-teal/30 text-teal hover:bg-teal/10 hover:border-teal/50"
            }`}
          >
            {isTogglingActive ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : account.isActive ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Check className="w-3 h-3" />
            )}
          </button>

          <button
            type="button"
            onClick={onEdit}
            title="Edit account"
            className="h-7 w-7 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-border flex items-center justify-center transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onChangePassword}
            title="Change password"
            className="h-7 w-7 rounded-lg border border-border/50 text-muted-foreground hover:text-teal hover:border-teal/40 flex items-center justify-center transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            title="Delete account"
            className="h-7 w-7 rounded-lg border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/40 flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Privilege Panel */}
      {isExpanded && (
        <div className="p-4 bg-card/30 border-t border-border/30">
          <PrivilegePanel account={account} onClose={onToggleExpand} />
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const { actor } = useActor();

  // Queries
  const { data: credentialUsers = [], isLoading: usersLoading } =
    useListCredentialUsers();
  const createUser = useCreateCredentialUser();
  const updateUser = useUpdateCredentialUser();
  const deleteUser = useDeleteCredentialUser();
  const resetPassword = useResetCredentialPassword();

  // UI State
  const [expandedId, setExpandedId] = useState<bigint | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAccount, setEditingAccount] =
    useState<CredentialAccount | null>(null);
  const [passwordAccount, setPasswordAccount] =
    useState<CredentialAccount | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<CredentialAccount | null>(
    null,
  );
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  // Create form
  const [createForm, setCreateForm] = useState({
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "CEO" as "CEO" | "Manager",
  });
  const [createError, setCreateError] = useState("");

  // Edit form
  const [editForm, setEditForm] = useState({
    displayName: "",
    role: "CEO" as "CEO" | "Manager",
    isActive: true,
  });

  // Password form
  const [pwForm, setPwForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [pwError, setPwError] = useState("");

  // II Principal assignment
  const [principalId, setPrincipalId] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);
  const [isAssigning, setIsAssigning] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (
      !createForm.displayName.trim() ||
      !createForm.username.trim() ||
      !createForm.password
    ) {
      setCreateError("All fields are required");
      return;
    }
    if (createForm.password !== createForm.confirmPassword) {
      setCreateError("Passwords do not match");
      return;
    }
    if (createForm.password.length < 6) {
      setCreateError("Password must be at least 6 characters");
      return;
    }

    try {
      const hash = await hashPassword(createForm.password);
      await createUser.mutateAsync({
        username: createForm.username.trim(),
        passwordHash: hash,
        displayName: createForm.displayName.trim(),
        role: createForm.role,
      });
      toast.success(`Account created for ${createForm.displayName}`);
      setShowCreateDialog(false);
      setCreateForm({
        displayName: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "CEO",
      });
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create account",
      );
    }
  };

  const openEdit = (account: CredentialAccount) => {
    setEditingAccount(account);
    setEditForm({
      displayName: account.displayName,
      role: account.role as "CEO" | "Manager",
      isActive: account.isActive,
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    try {
      await updateUser.mutateAsync({
        id: editingAccount.id,
        displayName: editForm.displayName.trim(),
        role: editForm.role,
        isActive: editForm.isActive,
      });
      toast.success("Account updated successfully");
      setEditingAccount(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update account",
      );
    }
  };

  const openChangePassword = (account: CredentialAccount) => {
    setPasswordAccount(account);
    setPwForm({ newPassword: "", confirmPassword: "" });
    setPwError("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (!passwordAccount) return;
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    try {
      const hash = await hashPassword(pwForm.newPassword);
      await resetPassword.mutateAsync({
        id: passwordAccount.id,
        newPasswordHash: hash,
      });
      toast.success("Password changed successfully");
      setPasswordAccount(null);
    } catch (err) {
      setPwError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteAccount) return;
    try {
      await deleteUser.mutateAsync(deleteAccount.id);
      toast.success(`${deleteAccount.displayName} deleted`);
      setDeleteAccount(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete account",
      );
    }
  };

  const handleToggleActive = async (account: CredentialAccount) => {
    const key = String(account.id);
    setTogglingIds((prev) => new Set(prev).add(key));
    try {
      await updateUser.mutateAsync({
        id: account.id,
        displayName: account.displayName,
        role: account.role,
        isActive: !account.isActive,
      });
      toast.success(
        `Account ${account.isActive ? "deactivated" : "activated"}`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setTogglingIds((prev) => {
        const s = new Set(prev);
        s.delete(key);
        return s;
      });
    }
  };

  const handleAssignRole = async () => {
    if (!principalId.trim() || !actor) return;
    setIsAssigning(true);
    try {
      const principal = Principal.fromText(principalId.trim());
      await actor.assignCallerUserRole(principal, selectedRole);
      toast.success(`Role "${selectedRole}" assigned successfully!`);
      setPrincipalId("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to assign role");
    } finally {
      setIsAssigning(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shadow-glow-gold">
            <UserCog className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              User Management
            </h2>
            <p className="text-sm text-muted-foreground font-sans">
              Create staff accounts and control their module access privileges
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* ── Section A: Staff Accounts ─────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal" />
              <h3 className="text-lg font-display font-semibold text-foreground">
                Staff Accounts
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] border-border text-muted-foreground ml-1"
              >
                {credentialUsers.length}
              </Badge>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="gradient-gold text-sidebar font-display font-semibold text-sm px-4 h-9"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Account
            </Button>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          ) : credentialUsers.length === 0 ? (
            <div className="rounded-xl border border-border/40 bg-card/30 p-8 text-center">
              <UserPlus className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-display font-medium text-foreground/70">
                No staff accounts yet
              </p>
              <p className="text-sm text-muted-foreground font-sans mt-1">
                Create accounts for CEO and Manager roles
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="mt-4 gradient-gold text-sidebar font-display font-semibold text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create First Account
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {credentialUsers.map((account) => (
                <UserRow
                  key={String(account.id)}
                  account={account}
                  isExpanded={expandedId === account.id}
                  onToggleExpand={() =>
                    setExpandedId((prev) =>
                      prev === account.id ? null : account.id,
                    )
                  }
                  onEdit={() => openEdit(account)}
                  onChangePassword={() => openChangePassword(account)}
                  onDelete={() => setDeleteAccount(account)}
                  onToggleActive={() => handleToggleActive(account)}
                  isTogglingActive={togglingIds.has(String(account.id))}
                />
              ))}
            </div>
          )}
        </section>

        <Separator className="bg-border/40" />

        {/* ── Section C: Internet Identity Role Assignment ───────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-display font-semibold text-foreground">
              Internet Identity Users
            </h3>
          </div>

          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal" />
                Assign Principal Role
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                Grant admin or user role to Internet Identity principals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-sans text-xs">User Principal ID</Label>
                <Input
                  value={principalId}
                  onChange={(e) => setPrincipalId(e.target.value)}
                  placeholder="e.g. aaaaa-bbbbb-ccccc-ddddd-eee"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground font-sans">
                  The user must be logged in and have a profile set up.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="font-sans text-xs">Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(v) => setSelectedRole(v as UserRole)}
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={UserRole.user}
                      className="font-sans text-sm"
                    >
                      User (Manager / CEO)
                    </SelectItem>
                    <SelectItem
                      value={UserRole.admin}
                      className="font-sans text-sm"
                    >
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAssignRole}
                disabled={isAssigning || !principalId.trim()}
                className="w-full font-sans bg-teal hover:bg-teal-dark text-white"
              >
                {isAssigning ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                Assign Role
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ── Create Account Dialog ─────────────────────────────────────────── */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-popover border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold" />
              Create Staff Account
            </DialogTitle>
            <DialogDescription className="font-sans text-xs">
              Create login credentials for CEO or Manager role.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="font-sans text-xs">Display Name</Label>
                <Input
                  value={createForm.displayName}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      displayName: e.target.value,
                    }))
                  }
                  placeholder="e.g. Rajesh Kumar"
                  className="font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-sans text-xs">Username</Label>
                <Input
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      username: e.target.value.toLowerCase().replace(/\s/g, ""),
                    }))
                  }
                  placeholder="e.g. rajesh.kumar"
                  className="font-mono text-sm"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-sans text-xs">Role</Label>
                <Select
                  value={createForm.role}
                  onValueChange={(v) =>
                    setCreateForm((f) => ({
                      ...f,
                      role: v as "CEO" | "Manager",
                    }))
                  }
                >
                  <SelectTrigger className="font-sans text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CEO" className="font-sans text-sm">
                      CEO
                    </SelectItem>
                    <SelectItem value="Manager" className="font-sans text-sm">
                      Manager
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-sans text-xs">Password</Label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Min. 6 characters"
                  className="font-sans text-sm"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-sans text-xs">Confirm Password</Label>
                <Input
                  type="password"
                  value={createForm.confirmPassword}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Repeat password"
                  className="font-sans text-sm"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {createError && (
              <p className="text-xs text-destructive font-sans flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                {createError}
              </p>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="border-border/60 text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createUser.isPending}
                className="gradient-gold text-sidebar font-display font-semibold"
              >
                {createUser.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Account Dialog ───────────────────────────────────────────── */}
      <Dialog
        open={!!editingAccount}
        onOpenChange={(open) => !open && setEditingAccount(null)}
      >
        <DialogContent className="bg-popover border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-teal" />
              Edit Account
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Display Name</Label>
              <Input
                value={editForm.displayName}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, displayName: e.target.value }))
                }
                className="font-sans text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(v) =>
                  setEditForm((f) => ({ ...f, role: v as "CEO" | "Manager" }))
                }
              >
                <SelectTrigger className="font-sans text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEO" className="font-sans text-sm">
                    CEO
                  </SelectItem>
                  <SelectItem value="Manager" className="font-sans text-sm">
                    Manager
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20">
              <div>
                <p className="font-sans text-sm text-foreground">
                  Account Active
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  Inactive users cannot log in
                </p>
              </div>
              <Switch
                checked={editForm.isActive}
                onCheckedChange={(v) =>
                  setEditForm((f) => ({ ...f, isActive: v }))
                }
                className="data-[state=checked]:bg-teal"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingAccount(null)}
                className="border-border/60 text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateUser.isPending}
                className="bg-teal hover:bg-teal-dark text-white font-display font-semibold"
              >
                {updateUser.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Change Password Dialog ────────────────────────────────────────── */}
      <Dialog
        open={!!passwordAccount}
        onOpenChange={(open) => !open && setPasswordAccount(null)}
      >
        <DialogContent className="bg-popover border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-teal" />
              Change Password
            </DialogTitle>
            <DialogDescription className="font-sans text-xs">
              Set a new password for {passwordAccount?.displayName}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="font-sans text-xs">New Password</Label>
              <Input
                type="password"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, newPassword: e.target.value }))
                }
                placeholder="Min. 6 characters"
                className="font-sans text-sm"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-sans text-xs">Confirm New Password</Label>
              <Input
                type="password"
                value={pwForm.confirmPassword}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                placeholder="Repeat new password"
                className="font-sans text-sm"
                autoComplete="new-password"
              />
            </div>

            {pwError && (
              <p className="text-xs text-destructive font-sans flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                {pwError}
              </p>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordAccount(null)}
                className="border-border/60 text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={resetPassword.isPending}
                className="bg-teal hover:bg-teal-dark text-white font-display font-semibold"
              >
                {resetPassword.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4 mr-2" />
                )}
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      <Dialog
        open={!!deleteAccount}
        onOpenChange={(open) => !open && setDeleteAccount(null)}
      >
        <DialogContent className="bg-popover border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="font-sans text-sm">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                {deleteAccount?.displayName}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteAccount(null)}
              className="border-border/60 text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteUser.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-display font-semibold"
            >
              {deleteUser.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
