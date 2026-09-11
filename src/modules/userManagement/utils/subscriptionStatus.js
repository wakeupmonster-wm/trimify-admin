export function resolveSubscriptionStatus(user = {}) {
  const expiry = user.subscription_expires_at || user.plan_expiry;
  const expiryDate = expiry ? new Date(expiry) : null;
  const hasValidExpiry =
    !expiry ||
    (!Number.isNaN(expiryDate?.getTime()) && expiryDate >= new Date());
  const isActive = Number(user.paid) === 1 && hasValidExpiry;

  // Entitlement wins over a stale historical revoke marker. The backend also
  // applies this rule, but keeping it here prevents an old cached response
  // from briefly showing "Revoked" after a successful re-purchase.
  if (isActive) return "Active";
  if (user.revoked_at) return "Revoked";

  return user.subscription_status || user.status || "Active";
}
