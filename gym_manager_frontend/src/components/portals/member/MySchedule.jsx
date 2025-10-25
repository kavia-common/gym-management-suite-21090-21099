import React from "react";
import Card from "../../common/Card";
import Table from "../../common/Table";
import Loader from "../../common/Loader";
import Button from "../../common/Button";
import { useClasses } from "../../../hooks/useClasses";

/**
 * PUBLIC_INTERFACE
 * MySchedule renders upcoming classes for the member with quick booking action placeholder.
 */
export default function MySchedule({ onBook }) {
  const classes = useClasses({ pageSize: 10, orderBy: "start_time", ascending: true });
  const columns = [
    { header: "Class", accessor: "title" },
    { header: "Start", accessor: "start_time" },
    { header: "Spots", accessor: "spots" },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => <Button size="sm" onClick={() => onBook?.(r)}>Book</Button>,
    },
  ];
  return (
    <Card title="My Schedule" action={<Button variant="ghost" onClick={classes.refresh}>↻ Refresh</Button>}>
      {classes.loading && <Loader label="Loading classes..." />}
      <Table columns={columns} data={Array.isArray(classes.data) ? classes.data : []} emptyMessage="No classes." />
    </Card>
  );
}
