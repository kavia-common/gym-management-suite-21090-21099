import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useProfile } from "../hooks/useProfile";

export default function Settings() {
  const { data: profile, loading, error } = useProfile(true);

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 16, maxWidth: 720 }}>
        <Card title="Organization Settings" action={<Button variant="secondary">Save</Button>}>
          <div className="row">
            <div className="col">
              <Input id="orgName" label="Organization Name" placeholder="GymCo" />
            </div>
            <div className="col">
              <Input id="timezone" label="Timezone" placeholder="e.g. UTC" />
            </div>
          </div>
        </Card>

        <Card title="My Profile (placeholder)">
          {loading && <Loader label="Loading profile..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)" }}>{error}</div>}
          {!loading && !error && (
            <div className="text-muted">
              {profile ? `Profile loaded for id: ${profile.id}` : "No profile found or not configured."}
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
