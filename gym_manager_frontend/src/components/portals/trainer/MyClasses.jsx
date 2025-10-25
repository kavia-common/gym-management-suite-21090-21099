import React from "react";
import Card from "../../common/Card";
import Table from "../../common/Table";
import Loader from "../../common/Loader";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import { useClasses } from "../../../hooks/useClasses";

/**
 * PUBLIC_INTERFACE
 * MyClasses shows trainer's classes. Filtering by trainer_id can be added when available.
 */
export default function MyClasses() {
  const classes = useClasses({ pageSize: 10, orderBy: "start_time", ascending: true });
  const columns = [
    { header: "Class", accessor: "title" },
    { header: "Start", accessor: "start_time" },
    { header: "Spots", accessor: "spots" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "open" ? "success" : "warning"}>{r.status ?? "unknown"}</Badge> },
  ];

  return (
    <Card title="My Classes" action={<Button variant="ghost" onClick={classes.refresh}>↻ Refresh</Button>}>
      {classes.loading && <Loader label="Loading classes..." />}
      <Table columns={columns} data={Array.isArray(classes.data) ? classes.data : []} emptyMessage="No classes assigned." />
    </Card>
  );
}
