import React from "react";
import Card from "../../common/Card";
import Table from "../../common/Table";
import Loader from "../../common/Loader";
import Button from "../../common/Button";
import Badge from "../../common/Badge";
import { useBookings } from "../../../hooks/useBookings";

/**
 * PUBLIC_INTERFACE
 * AttendanceList shows bookings for trainer classes and allows marking attendance.
 */
export default function AttendanceList({ onMark }) {
  const bookings = useBookings({ pageSize: 10, orderBy: "created_at", ascending: false });
  const columns = [
    { header: "Member", accessor: "member_name" },
    { header: "Class", accessor: "class_title" },
    { header: "Time", accessor: "scheduled_at" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "attended" ? "success" : "warning"}>{r.status ?? "pending"}</Badge> },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => (
        <div style={{ display: "inline-flex", gap: 8 }}>
          <Button size="sm" onClick={() => onMark?.(r, true)} disabled={r.status === "attended"}>Attended</Button>
          <Button size="sm" variant="ghost" onClick={() => onMark?.(r, false)} disabled={r.status === "absent"}>Absent</Button>
        </div>
      ),
    },
  ];
  return (
    <Card title="Attendance List" action={<Button variant="ghost" onClick={bookings.refresh}>↻ Refresh</Button>}>
      {bookings.loading && <Loader label="Loading bookings..." />}
      <Table columns={columns} data={Array.isArray(bookings.data) ? bookings.data : []} emptyMessage="No bookings." />
    </Card>
  );
}
