import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Badge from "../common/Badge";
import Table from "../common/Table";
import Modal from "../common/Modal";
import Snackbar from "../common/Snackbar";
import Loader from "../common/Loader";

/**
 * PUBLIC_INTERFACE
 * Application shell providing sidebar, topbar and content area.
 */
export default function Shell() {
  const [modalOpen, setModalOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [plan, setPlan] = useState("");

  const columns = [
    { header: "Member", accessor: "member" },
    { header: "Plan", accessor: "plan", cell: (r) => <Badge tone="info">{r.plan}</Badge> },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "Active" ? "success" : "warning"}>{r.status}</Badge> },
  ];

  const data = [
    { id: 1, member: "Alex Brown", plan: "Gold", status: "Active" },
    { id: 2, member: "Jamie Lee", plan: "Basic", status: "Paused" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main className="container" style={{ padding: 16, display: "grid", gap: 16 }}>
          <div className="row">
            <div className="col">
              <Card
                title="Quick Actions"
                action={
                  <Button onClick={() => setSnackOpen(true)} variant="secondary">
                    Show Notice
                  </Button>
                }
              >
                <div className="row">
                  <div className="col">
                    <Input
                      id="memberName"
                      label="Member Name"
                      placeholder="e.g. Alex Brown"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <Select
                      id="plan"
                      label="Plan"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      options={[
                        { value: "basic", label: "Basic" },
                        { value: "gold", label: "Gold" },
                        { value: "platinum", label: "Platinum" },
                      ]}
                      placeholder="Choose plan"
                    />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <Button onClick={() => setModalOpen(true)}>Add Member</Button>
                  <Button variant="ghost">Export</Button>
                </div>
              </Card>
            </div>
            <div className="col">
              <Card title="System Status" action={<Loader label="Syncing..." />}>
                <div className="text-muted">All services operating normally.</div>
              </Card>
            </div>
          </div>

          <Card title="Recent Memberships">
            <Table columns={columns} data={data} />
          </Card>
        </main>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Member"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="row">
          <div className="col">
            <Input id="modalName" label="Full Name" placeholder="Full name" />
          </div>
          <div className="col">
            <Select
              id="modalPlan"
              label="Plan"
              options={[
                { value: "basic", label: "Basic" },
                { value: "gold", label: "Gold" },
                { value: "platinum", label: "Platinum" },
              ]}
            />
          </div>
        </div>
      </Modal>

      <Snackbar open={snackOpen} onClose={() => setSnackOpen(false)} message="This is a notification." />
    </div>
  );
}
