import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Settings() {
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
      </div>
    </Shell>
  );
}
