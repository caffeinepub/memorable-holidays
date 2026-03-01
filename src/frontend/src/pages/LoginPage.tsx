import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Globe,
  KeyRound,
  Loader2,
  Shield,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCredentialSession } from "../contexts/CredentialSessionContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const {
    login: iiLogin,
    loginStatus,
    identity,
    isInitializing,
  } = useInternetIdentity();
  const { isCredentialUser, login: credentialLogin } = useCredentialSession();
  const navigate = useNavigate();

  // Credential form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credError, setCredError] = useState("");
  const [isCredLoggingIn, setIsCredLoggingIn] = useState(false);

  useEffect(() => {
    if (identity || isCredentialUser) navigate({ to: "/" });
  }, [identity, isCredentialUser, navigate]);

  const isIILoggingIn = loginStatus === "logging-in";

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setCredError("Please enter username and password");
      return;
    }
    setCredError("");
    setIsCredLoggingIn(true);
    try {
      const result = await credentialLogin(username.trim(), password);
      if (!result.success) {
        setCredError(result.message || "Invalid username or password");
      }
    } catch {
      setCredError("Login failed. Please try again.");
    } finally {
      setIsCredLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--gold)), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--teal)), transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--gold)), oklch(var(--teal)), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold/10 border border-gold/30 mb-5 shadow-glow-gold">
              <Globe className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-4xl font-display font-bold text-gradient-gold mb-2 tracking-tight">
              Memorable Holidays
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Premium Tourism Package Designer
            </p>
          </div>

          {/* Card with Tabs */}
          <div className="glass rounded-2xl p-6 border border-border/60 shadow-2xl">
            <Tabs defaultValue="identity" className="w-full">
              <TabsList className="w-full mb-6 bg-muted/50 rounded-xl p-1">
                <TabsTrigger
                  value="identity"
                  className="flex-1 text-xs font-sans rounded-lg data-[state=active]:bg-card data-[state=active]:text-gold data-[state=active]:shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Internet Identity
                </TabsTrigger>
                <TabsTrigger
                  value="credentials"
                  className="flex-1 text-xs font-sans rounded-lg data-[state=active]:bg-card data-[state=active]:text-teal data-[state=active]:shadow-sm"
                >
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  Staff Login
                </TabsTrigger>
              </TabsList>

              {/* Internet Identity Tab */}
              <TabsContent value="identity" className="mt-0">
                <div className="mb-5">
                  <h2 className="text-lg font-display font-semibold text-foreground mb-1">
                    Admin Login
                  </h2>
                  <p className="text-sm text-muted-foreground font-sans">
                    Sign in securely with Internet Identity
                  </p>
                </div>

                <Button
                  onClick={iiLogin}
                  disabled={isIILoggingIn || isInitializing}
                  className="w-full gradient-gold text-sidebar font-display font-bold py-6 text-base rounded-xl shadow-gold hover:shadow-glow-gold transition-all duration-300 animate-pulse-gold"
                >
                  {isIILoggingIn || isInitializing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isIILoggingIn ? "Signing In..." : "Initializing..."}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Sign In with Internet Identity
                    </>
                  )}
                </Button>

                <div className="mt-5 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans">
                    <Shield className="w-4 h-4 text-teal shrink-0" />
                    <span>
                      Secure, decentralized authentication. No passwords
                      required.
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Staff Credentials Tab */}
              <TabsContent value="credentials" className="mt-0">
                <div className="mb-5">
                  <h2 className="text-lg font-display font-semibold text-foreground mb-1">
                    Staff Login
                  </h2>
                  <p className="text-sm text-muted-foreground font-sans">
                    CEO & Manager access with credentials
                  </p>
                </div>

                <form onSubmit={handleCredentialLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-sans text-xs text-foreground/80">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="pl-9 font-sans text-sm bg-muted/30 border-border/60 focus:border-teal/60"
                        autoComplete="username"
                        disabled={isCredLoggingIn}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-sans text-xs text-foreground/80">
                      Password
                    </Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-9 font-sans text-sm bg-muted/30 border-border/60 focus:border-teal/60"
                        autoComplete="current-password"
                        disabled={isCredLoggingIn}
                      />
                    </div>
                  </div>

                  {credError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-sans">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {credError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isCredLoggingIn || !username || !password}
                    className="w-full bg-teal hover:bg-teal-dark text-white font-display font-bold py-5 rounded-xl transition-all duration-200 shadow-teal hover:shadow-glow-teal"
                  >
                    {isCredLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans">
                    <Shield className="w-4 h-4 text-gold shrink-0" />
                    <span>
                      Account created by admin. Contact your administrator for
                      access.
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-center text-xs text-muted-foreground/50 mt-6 font-sans">
            © {new Date().getFullYear()} Memorable Holidays. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
