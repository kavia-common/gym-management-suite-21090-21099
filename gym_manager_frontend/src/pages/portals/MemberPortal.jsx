import React, { useMemo, useState } from "react";
import Shell from "../../components/layout/Shell";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import Snackbar from "../../components/common/Snackbar";
import { useBookings } from "../../hooks/useBookings";
import { useClasses } from "../../hooks/useClasses";
import { useProfile } from "../../hooks/useProfile";

/**
 * PUBLIC_INTERFACE
 * MemberPortal renders a personalized view for gym members:
 * - My Schedule (upcoming classes)
 * - My Bookings (book/cancel)
 * - My Membership info (placeholder)
 */
export default function MemberPortal() {
  const { data: profile, loading: loadingProfile } = useProfile();

  // Load classes and bookings scoped to the current member if available.
  // Assuming classes and bookings tables can be filtered by member_id or email; as placeholders we just show lists.
  const classes = useClasses({ pageSize: 10, orderBy: "start_time", ascending: true });
  const bookings = useBookings({ pageSize: 10, orderBy: "created_at", ascending: false });

  const [toast, setToast] = useState({ open: false, message: "", tone: "info" });

  function pushToast(message, tone = "info") {
    setToast({ open: true, message, tone });
  }

  function closeToast() {
    setToast({ ...toast, open: false });
  }

  async function handleBook(c) {
    try {
      await bookings.create({
        class_id: c.id,
        class_title: c.title || `#${c.id}`,
        member_name: profile?.full_name || "Me",
        status: "pending",
        scheduled_at: c.start_time || new Date().toISOString(),
      });
      pushToast("Booking created. Awaiting confirmation.", "success");
    } catch (e) {
      pushToast(e?.message || "Failed to create booking.", "danger");
    }
  }

  async function handleCancel(b) {
    try {
      // Soft-cancel by updating status if you prefer. Here, remove row for placeholder.
      await bookings.update(b.id, { status: "canceled" });
      pushToast("Booking canceled.", "success");
    } catch (e) {
      pushToast(e?.message || "Failed to cancel booking.", "danger");
    }
  }

  const upcomingClassColumns = [
    { header: "Class", accessor: "title" },
    { header: "Trainer", accessor: "trainer_name" },
    { header: "Start", accessor: "start_time" },
    { header: "Spots", accessor: "spots" },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => (
        <div style={{ display: "inline-flex", gap: 8 }}>
          <Button size="sm" onClick={() => handleBook(r)}>Book</Button>
        </div>
      ),
    },
  ];

  const myBookingsColumns = [
    { header: "Class", accessor: "class_title" },
    { header: "Time", accessor: "scheduled_at" },
    {
      header: "Status",
      accessor: "status",
      cell: (r) => (
        <Badge tone={r.status === "confirmed" ? "success" : r.status === "canceled" ? "danger" : "warning"}>
          {r.status ?? "pending"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => (
        <div style={{ display: "inline-flex", gap: 8 }}>
          <Button size="sm" variant="ghost" onClick={() => handleCancel(r)} disabled={r.status === "canceled"}>
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  const membershipInfo = useMemo(() => {
    // Placeholder: profile may contain plan or membership fields
    return {
      plan: profile?.plan_name || "Standard",
      status: profile?.membership_status || "active",
      renews: profile?.renews_at || "—",
    };
  }, [profile]);

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 16 }}>
        <Card title="Welcome back" action={<div className="text-muted">Member Portal</div>}>
          {loadingProfile ? (
            <Loader label="Loading your profile..." />
          ) : (
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {profile?.full_name || "Member"}
              </div>
              <div className="text-muted" style={{ marginTop: 4 }}>
                {profile?.email || "your@email"}
              </div>
            </div>
          )}
        </Card>

        <div className="row">
          <div className="col">
            <Card title="My Schedule">
              {classes.loading && <Loader label="Loading classes..." />}
              {classes.error && (
                <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>
                  {classes.error}
                </div>
              )}
              <Table
                columns={upcomingClassColumns}
                data={Array.isArray(classes.data) ? classes.data : []}
                emptyMessage={classes.loading ? "Loading..." : "No classes found."}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <Button variant="ghost" onClick={classes.refresh}>↻ Refresh</Button>
              </div>
            </Card>
          </div>
          <div className="col">
            <Card title="My Bookings">
              {bookings.loading && <Loader label="Loading bookings..." />}
              {bookings.error && (
                <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>
                  {bookings.error}
                </div>
              )}
              <Table
                columns={myBookingsColumns}
                data={Array.isArray(bookings.data) ? bookings.data : []}
                emptyMessage={bookings.loading ? "Loading..." : "No bookings yet."}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <Button variant="ghost" onClick={bookings.refresh}>↻ Refresh</Button>
              </div>
            </Card>
          </div>
        </div>

        <Card title="My Membership">
          <div className="row">
            <div className="col">
              <div className="text-muted">Plan</div>
              <div style={{ fontWeight: 700 }}>{membershipInfo.plan}</div>
            </div>
            <div className="col">
              <div className="text-muted">Status</div>
              <div><Badge tone={membershipInfo.status === "active" ? "success" : "warning"}>{membershipInfo.status}</Badge></div>
            </div>
            <div className="col">
              <div className="text-muted">Renews</div>
              <div style={{ fontWeight: 700 }}>{membershipInfo.renews}</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <Button variant="secondary">Update Payment (Placeholder)</Button>
          </div>
        </Card>
      </div>
      <Snackbar open={toast.open} message={toast.message} tone={toast.tone} onClose={closeToast} />
    </Shell>
  );
}
