import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";

/**
 * PUBLIC_INTERFACE
 * RoleRedirect navigates user to the appropriate portal based on profile.role.
 * admin -> dashboard, trainer -> /portal/trainer, member -> /portal/member
 */
export default function RoleRedirect() {
  const { data: profile, loading } = useProfile(true);
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    const role = profile?.role || "member";
    if (role === "trainer") nav("/portal/trainer", { replace: true });
    else if (role === "member") nav("/portal/member", { replace: true });
    else nav("/", { replace: true }); // admin or unknown -> dashboard
  }, [loading, profile, nav]);

  return (
    <div className="container" style={{ padding: 24 }}>
      <div className="text-muted">Redirecting based on your role…</div>
    </div>
  );
}
