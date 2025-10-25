import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useBookings } from "../hooks/useBookings";

export default function Bookings() {
  const { data, loading, error, page, setPage, pageSize, total, refresh } = useBookings({
    pageSize: 10,
    orderBy: "created_at",
    ascending: false,
  });

  const columns = [
    { header: "Member", accessor: "member_name" },
    { header: "Class", accessor: "class_title" },
    { header: "Time", accessor: "scheduled_at" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "confirmed" ? "success" : "warning"}>{r.status ?? "pending"}</Badge> },
  ];

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 12 }}>
        <Card title="Bookings" action={<Button variant="ghost" onClick={refresh}>↻ Refresh</Button>}>
          {loading && <Loader label="Loading bookings..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table
            columns={columns}
            data={Array.isArray(data) ? data : []}
            emptyMessage={loading ? "Loading..." : "No bookings found."}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>
              Page {page} of {totalPages} {total ? `• ${total} total` : ""}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>← Prev</Button>
              <Button variant="ghost" onClick={() => setPage(page + 1)} disabled={total && page >= totalPages}>Next →</Button>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
