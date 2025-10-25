import React from "react";
import Card from "../../common/Card";
import Table from "../../common/Table";
import Loader from "../../common/Loader";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import { useBookings } from "../../../hooks/useBookings";

/**
 * PUBLIC_INTERFACE
 * MyBookings lists member's bookings and allows cancel action placeholder.
 */
export default function MyBookings({ onCancel }) {
  const bookings = useBookings({ pageSize: 10, orderBy: "created_at", ascending: false });
  const columns = [
    { header: "Class", accessor: "class_title" },
    { header: "Time", accessor: "scheduled_at" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "confirmed" ? "success" : "warning"}>{r.status ?? "pending"}</Badge> },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => <Button size="sm" variant="ghost" onClick={() => onCancel?.(r)} disabled={r.status === "canceled"}>Cancel</Button>,
    },
  ];
  return (
    <Card title="My Bookings" action={<Button variant="ghost" onClick={bookings.refresh}>↻ Refresh</Button>}>
      {bookings.loading && <Loader label="Loading bookings..." />}
      <Table columns={columns} data={Array.isArray(bookings.data) ? bookings.data : []} emptyMessage="No bookings." />
    </Card>
  );
}
