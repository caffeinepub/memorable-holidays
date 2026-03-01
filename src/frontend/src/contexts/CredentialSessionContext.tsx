import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserPrivileges } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CredentialSession {
  accountId: bigint;
  displayName: string;
  role: string;
}

interface StoredSession {
  accountId: string; // bigint serialized as string
  displayName: string;
  role: string;
}

interface CredentialSessionContextValue {
  credentialSession: CredentialSession | null;
  privileges: UserPrivileges | null;
  isCredentialUser: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshPrivileges: () => Promise<void>;
}

// ── Utils ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mh_credential_session";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function serializeSession(session: CredentialSession): StoredSession {
  return {
    accountId: String(session.accountId),
    displayName: session.displayName,
    role: session.role,
  };
}

function deserializeSession(stored: StoredSession): CredentialSession {
  return {
    accountId: BigInt(stored.accountId),
    displayName: stored.displayName,
    role: stored.role,
  };
}

// ── Context ──────────────────────────────────────────────────────────────────

const CredentialSessionContext =
  createContext<CredentialSessionContextValue | null>(null);

export function CredentialSessionProvider({
  children,
}: { children: React.ReactNode }) {
  const { actor } = useActor();
  const [credentialSession, setCredentialSession] =
    useState<CredentialSession | null>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredSession;
          return deserializeSession(parsed);
        }
      } catch {
        // ignore parse errors
      }
      return null;
    });
  const [privileges, setPrivileges] = useState<UserPrivileges | null>(null);

  const fetchPrivileges = useCallback(
    async (accountId: bigint) => {
      if (!actor) return;
      try {
        const result = await actor.getPublicPrivileges(accountId);
        setPrivileges(result ?? null);
      } catch {
        setPrivileges(null);
      }
    },
    [actor],
  );

  // On mount / actor ready: reload privileges if session exists
  useEffect(() => {
    if (credentialSession && actor) {
      fetchPrivileges(credentialSession.accountId);
    }
  }, [credentialSession, actor, fetchPrivileges]);

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      if (!actor)
        return { success: false, message: "Not connected to backend" };
      try {
        const hash = await hashPassword(password);
        const result = await actor.loginWithCredentials(username, hash);
        if (result.success) {
          const session: CredentialSession = {
            accountId: result.accountId,
            displayName: result.displayName,
            role: result.role,
          };
          setCredentialSession(session);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(serializeSession(session)),
          );
          await fetchPrivileges(result.accountId);
        }
        return { success: result.success, message: result.message };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        return { success: false, message };
      }
    },
    [actor, fetchPrivileges],
  );

  const logout = useCallback(() => {
    setCredentialSession(null);
    setPrivileges(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshPrivileges = useCallback(async () => {
    if (credentialSession) {
      await fetchPrivileges(credentialSession.accountId);
    }
  }, [credentialSession, fetchPrivileges]);

  return (
    <CredentialSessionContext.Provider
      value={{
        credentialSession,
        privileges,
        isCredentialUser: credentialSession !== null,
        login,
        logout,
        refreshPrivileges,
      }}
    >
      {children}
    </CredentialSessionContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCredentialSession() {
  const ctx = useContext(CredentialSessionContext);
  if (!ctx)
    throw new Error(
      "useCredentialSession must be used within CredentialSessionProvider",
    );
  return ctx;
}
