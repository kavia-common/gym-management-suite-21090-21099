import React from "react";
import Card from "../../common/Card";
import Badge from "../../common/Badge";
import Button from "../../common/Button";
import { useProfile } from "../../../hooks/useProfile";

/**
 * PUBLIC_INTERFACE
 * MyMembership shows the member's membership plan and status.
 */
export default function MyMembership() {
  const { data: profile, loading, error } = useProfile();

  const plan = profile?.plan_name || "Standard";
  const status = profile?.membership_status || "active";
  const renews = profile?.renews_at || "—";

  return (
    <Card title="My Membership" action={<Button variant="secondary">Update Payment (Placeholder)</Button>}>
      {loading && <div className="text-muted">Loading membership…</div>}
      {error && <div className="text-muted" style={{ color: "var(--color-error)" }}>{String(error)}</div>}
      {!loading && !error && (
        <div className="row">
          <div className="col">
            <div className="text-muted">Plan</div>
            <div style={{ fontWeight: 700 }}>{plan}</div>
          </div>
          <div className="col">
            <div className="text-muted">Status</div>
            <div><Badge tone={status === "active" ? "success" : "warning"}>{status}</Badge></div>
          </div>
          <div className="col">
            <div className="text-muted">Renews</div>
            <div style={{ fontWeight: 700 }}>{renews}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
