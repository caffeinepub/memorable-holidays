import { Outlet } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCredentialSession } from "../../contexts/CredentialSessionContext";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../../hooks/useQueries";
import ProfileSetupModal from "../auth/ProfileSetupModal";
import Footer from "./Footer";
import Header from "./Header";
import Navigation from "./Navigation";

export default function AppLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isCredentialUser } = useCredentialSession();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity || isCredentialUser;
  const showProfileSetup =
    !!identity && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 shadow-glow-gold">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground font-sans text-sm">
            Loading Memorable Holidays...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
