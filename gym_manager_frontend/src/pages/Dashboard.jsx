import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Table from "../components/common/Table";

export default function Dashboard() {
  const columns = [
    { header: "Metric", accessor: "metric" },
    { header: "Value", accessor: "value", cell: (r) => <Badge tone="info">{r.value}</Badge> },
  ];
  const data = [
    { id: 1, metric: "Active Members", value: "128" },
    { id: 2, metric: "Classes Today", value: "12" },
    { id: 3, metric: "Bookings Pending", value: "7" },
  ];
  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 16 }}>
        <Card title="Overview">
          <Table columns={columns} data={data} />
        </Card>
      </div>
    </Shell>
  );
}
