import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Badge from "../components/common/Badge";

export default function Memberships() {
  const columns = [
    { header: "Member", accessor: "member" },
    { header: "Plan", accessor: "plan" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "Active" ? "success" : "warning"}>{r.status}</Badge> },
  ];
  const data = [
    { id: 1, member: "Alex Brown", plan: "Gold", status: "Active" },
    { id: 2, member: "Jamie Lee", plan: "Basic", status: "Paused" },
  ];
  return (
    <Shell>
      <div className="container" style={{ padding: 16 }}>
        <Card title="Memberships">
          <Table columns={columns} data={data} />
        </Card>
      </div>
    </Shell>
  );
}
