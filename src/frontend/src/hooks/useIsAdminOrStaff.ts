import { useCredentialSession } from "../contexts/CredentialSessionContext";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Returns true if the current user is:
 *  - an admin logged in via Internet Identity, OR
 *  - a staff member (CEO / Manager) logged in with username+password credentials
 *
 * Returns false for unauthenticated or guest views.
 *
 * Use this to gate markup details, internal cost breakdowns, and admin-only data.
 */
export function useIsAdminOrStaff(): boolean {
  const { identity } = useInternetIdentity();
  const { isCredentialUser } = useCredentialSession();
  return !!identity || isCredentialUser;
}

/**
 * Returns true ONLY for the Internet Identity admin (not staff credential users).
 * Use this to gate write actions like creating/editing/deleting markup rules.
 */
export function useIsAdmin(): boolean {
  const { identity } = useInternetIdentity();
  return !!identity;
}
