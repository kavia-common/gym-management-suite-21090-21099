import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Badge from "../components/common/Badge";

export default function Classes() {
  const columns = [
    { header: "Class", accessor: "class" },
    { header: "Trainer", accessor: "trainer" },
    { header: "Spots", accessor: "spots" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "Open" ? "success" : "warning"}>{r.status}</Badge> },
  ];
  const data = [
    { id: 1, class: "HIIT", trainer: "Sam", spots: "10/20", status: "Open" },
    { id: 2, class: "Yoga", trainer: "Mia", spots: "18/20", status: "Open" },
  ];
  return (
    <Shell>
      <div className="container" style={{ padding: 16 }}>
        <Card title="Classes">
          <Table columns={columns} data={data} />
        </Card>
      </div>
    </Shell>
  );
}
