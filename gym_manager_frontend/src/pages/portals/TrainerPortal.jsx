import React, { useState } from "react";
import Shell from "../../components/layout/Shell";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import Snackbar from "../../components/common/Snackbar";
import { useClasses } from "../../hooks/useClasses";
import { useBookings } from "../../hooks/useBookings";
import { useProfile } from "../../hooks/useProfile";

/**
 * PUBLIC_INTERFACE
 * TrainerPortal renders tools for trainers:
 * - My Classes (list classes assigned to me, placeholder filter)
 * - Attendance List (bookings for today's classes, mark attended)
 */
export default function TrainerPortal() {
  const { data: profile, loading: loadingProfile } = useProfile(true);
  // For now just load lists; filtering to trainer_id can be added once available.
  const classes = useClasses({ pageSize: 10, orderBy: "start_time", ascending: true });
  const bookings = useBookings({ pageSize: 10, orderBy: "created_at", ascending: false });

  const [toast, setToast] = useState({ open: false, message: "", tone: "info" });

  function pushToast(message, tone = "info") {
    setToast({ open: true, message, tone });
  }
  function closeToast() {
    setToast({ ...toast, open: false });
  }

  async function markAttendance(row, attended) {
    try {
      await bookings.update(row.id, { status: attended ? "attended" : "absent" });
      pushToast(attended ? "Marked as attended." : "Marked as absent.", "success");
    } catch (e) {
      pushToast(e?.message || "Failed to update attendance.", "danger");
    }
  }

  const myClassesColumns = [
    { header: "Class", accessor: "title" },
    { header: "Start", accessor: "start_time" },
    { header: "Spots", accessor: "spots" },
    {
      header: "Status",
      accessor: "status",
      cell: (r) => <Badge tone={r.status === "open" ? "success" : r.status === "canceled" ? "danger" : "warning"}>{r.status ?? "unknown"}</Badge>,
    },
  ];

  const attendanceColumns = [
    { header: "Member", accessor: "member_name" },
    { header: "Class", accessor: "class_title" },
    { header: "Time", accessor: "scheduled_at" },
    {
      header: "Status",
      accessor: "status",
      cell: (r) => (
        <Badge
          tone={
            r.status === "attended" ? "success" : r.status === "canceled" ? "danger" : r.status === "confirmed" ? "info" : "warning"
          }
        >
          {r.status ?? "pending"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => (
        <div style={{ display: "inline-flex", gap: 8 }}>
          <Button size="sm" onClick={() => markAttendance(r, true)} disabled={r.status === "attended"}>Attended</Button>
          <Button size="sm" variant="ghost" onClick={() => markAttendance(r, false)} disabled={r.status === "absent"}>Absent</Button>
        </div>
      ),
    },
  ];

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 16 }}>
        <Card title="Hello Trainer" action={<div className="text-muted">Trainer Portal</div>}>
          {loadingProfile ? (
            <Loader label="Loading your profile..." />
          ) : (
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {profile?.full_name || "Trainer"}
              </div>
              <div className="text-muted" style={{ marginTop: 4 }}>
                {profile?.email || "your@email"}
              </div>
            </div>
          )}
        </Card>

        <div className="row">
          <div className="col">
            <Card title="My Classes" action={<Button variant="ghost" onClick={classes.refresh}>↻ Refresh</Button>}>
              {classes.loading && <Loader label="Loading classes..." />}
              {classes.error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{classes.error}</div>}
              <Table
                columns={myClassesColumns}
                data={Array.isArray(classes.data) ? classes.data : []}
                emptyMessage={classes.loading ? "Loading..." : "No classes assigned."}
              />
            </Card>
          </div>
          <div className="col">
            <Card title="Attendance List" action={<Button variant="ghost" onClick={bookings.refresh}>↻ Refresh</Button>}>
              {bookings.loading && <Loader label="Loading bookings..." />}
              {bookings.error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{bookings.error}</div>}
              <Table
                columns={attendanceColumns}
                data={Array.isArray(bookings.data) ? bookings.data : []}
                emptyMessage={bookings.loading ? "Loading..." : "No bookings to show."}
              />
            </Card>
          </div>
        </div>
      </div>
      <Snackbar open={toast.open} message={toast.message} tone={toast.tone} onClose={closeToast} />
    </Shell>
  );
}
