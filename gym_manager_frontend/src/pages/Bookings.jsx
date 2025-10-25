import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Badge from "../components/common/Badge";

export default function Bookings() {
  const columns = [
    { header: "Member", accessor: "member" },
    { header: "Class", accessor: "class" },
    { header: "Time", accessor: "time" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "Confirmed" ? "success" : "warning"}>{r.status}</Badge> },
  ];
  const data = [
    { id: 1, member: "Alex Brown", class: "HIIT", time: "10:00 AM", status: "Confirmed" },
    { id: 2, member: "Jamie Lee", class: "Yoga", time: "2:00 PM", status: "Pending" },
  ];
  return (
    <Shell>
      <div className="container" style={{ padding: 16 }}>
        <Card title="Bookings">
          <Table columns={columns} data={data} />
        </Card>
      </div>
    </Shell>
  );
}
