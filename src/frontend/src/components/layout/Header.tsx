import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Globe, LogOut, Shield, User } from "lucide-react";
import { useCredentialSession } from "../../contexts/CredentialSessionContext";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../../hooks/useQueries";
import { companyStore } from "../../lib/companyStore";

export default function Header() {
  const { clear, identity } = useInternetIdentity();
  const {
    isCredentialUser,
    credentialSession,
    logout: credentialLogout,
  } = useCredentialSession();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const company = companyStore.get();

  const handleLogout = async () => {
    if (isCredentialUser) {
      credentialLogout();
    } else {
      await clear();
      queryClient.clear();
    }
  };

  const roleColors: Record<string, string> = {
    admin: "border-gold/50 text-gold bg-gold/10",
    manager: "border-teal/50 text-teal bg-teal/10",
    ceo: "border-gold/70 text-gold bg-gold/15",
    CEO: "border-gold/70 text-gold bg-gold/15",
    Manager: "border-teal/50 text-teal bg-teal/10",
  };

  const displayName = isCredentialUser
    ? credentialSession?.displayName
    : userProfile?.name;

  const displayRole = isCredentialUser
    ? credentialSession?.role
    : userProfile?.role;

  const roleBadgeClass =
    roleColors[displayRole || ""] || "border-border text-muted-foreground";

  return (
    <header className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-0 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt="Company Logo"
              className="h-9 w-9 rounded-full object-cover border-2 border-gold/60 shadow-glow-gold"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center">
              <Globe className="w-4 h-4 text-gold" />
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold leading-tight tracking-tight text-gradient-gold">
              Memorable Holidays
            </h1>
            {company.name && company.name !== "Memorable Holidays" && (
              <span className="text-[10px] text-muted-foreground leading-tight font-sans tracking-wide uppercase">
                {company.name}
              </span>
            )}
          </div>
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-3">
          {(identity || isCredentialUser) && displayName && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                {isCredentialUser ? (
                  <Shield className="w-4 h-4 text-teal" />
                ) : (
                  <User className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {displayName}
                </p>
                {displayRole && (
                  <Badge
                    variant="outline"
                    className={`text-[9px] h-4 px-1.5 capitalize ${roleBadgeClass}`}
                  >
                    {displayRole}
                  </Badge>
                )}
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border/60 text-muted-foreground hover:border-destructive/60 hover:text-destructive hover:bg-destructive/5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
