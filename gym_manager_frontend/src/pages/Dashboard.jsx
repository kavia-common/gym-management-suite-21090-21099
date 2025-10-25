import React, { useMemo } from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Table from "../components/common/Table";
import StatsGrid from "../components/common/StatsGrid";
import Button from "../components/common/Button";
import { useMembers } from "../hooks/useMembers";
import { useClasses } from "../hooks/useClasses";
import { useBookings } from "../hooks/useBookings";

export default function Dashboard() {
  // Pull light-weight counts using existing hooks (read-only summaries).
  const members = useMembers({ pageSize: 5 });
  const classes = useClasses({ pageSize: 5, orderBy: "start_time", ascending: true });
  const bookings = useBookings({ pageSize: 5, orderBy: "created_at", ascending: false });

  const totalMembers = members.total ?? (Array.isArray(members.data) ? members.data.length : 0);
  const upcomingClasses = classes.total ?? (Array.isArray(classes.data) ? classes.data.length : 0);
  const pendingBookings = useMemo(() => {
    const arr = Array.isArray(bookings.data) ? bookings.data : [];
    return arr.filter((b) => (b.status || "pending") !== "confirmed").length;
  }, [bookings.data]);

  const kpis = [
    { key: "active-members", title: "Active Members", value: totalMembers, subtitle: "All-time active", action: null },
    { key: "upcoming-classes", title: "Upcoming Classes", value: upcomingClasses, subtitle: "This week", action: null },
    { key: "occupancy", title: "Avg. Occupancy", value: "68%", subtitle: "Utilization estimate", action: null },
    { key: "revenue", title: "Revenue (Placeholder)", value: "$12.4k", subtitle: "MTD", action: <Button variant="ghost">Details</Button> },
  ];

  const upcomingColumns = [
    { header: "Class", accessor: "title" },
    { header: "Trainer", accessor: "trainer_name" },
    { header: "Start", accessor: "start_time" },
    { header: "Spots", accessor: "spots" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "open" ? "success" : "warning"}>{r.status ?? "unknown"}</Badge> },
  ];

  const bookingsColumns = [
    { header: "Member", accessor: "member_name" },
    { header: "Class", accessor: "class_title" },
    { header: "Time", accessor: "scheduled_at" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "confirmed" ? "success" : "warning"}>{r.status ?? "pending"}</Badge> },
  ];

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 16 }}>
        <StatsGrid items={kpis} />

        <div className="row">
          <div className="col">
            <Card title="Upcoming Classes" action={<Button variant="ghost" onClick={classes.refresh}>↻ Refresh</Button>}>
              <Table
                columns={upcomingColumns}
                data={Array.isArray(classes.data) ? classes.data : []}
                emptyMessage={classes.loading ? "Loading..." : "No classes found."}
              />
              <div className="text-muted" style={{ marginTop: 8, fontSize: 12 }}>
                Showing latest {Array.isArray(classes.data) ? classes.data.length : 0} items
              </div>
            </Card>
          </div>
          <div className="col">
            <Card title="Recent Bookings" action={<Button variant="ghost" onClick={bookings.refresh}>↻ Refresh</Button>}>
              <Table
                columns={bookingsColumns}
                data={Array.isArray(bookings.data) ? bookings.data : []}
                emptyMessage={bookings.loading ? "Loading..." : "No bookings found."}
              />
              <div className="text-muted" style={{ marginTop: 8, fontSize: 12 }}>
                Pending: {pendingBookings}
              </div>
            </Card>
          </div>
        </div>

        <Card title="Revenue Overview (Placeholder)">
          <div
            className="card-surface"
            style={{
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed var(--color-border)",
              background: "#fbfdff",
            }}
          >
            <div className="text-muted">Charts coming soon…</div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
