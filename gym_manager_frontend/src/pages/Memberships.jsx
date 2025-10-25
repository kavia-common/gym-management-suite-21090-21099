import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useMembers } from "../hooks/useMembers";

export default function Memberships() {
  const { data, loading, error, page, setPage, pageSize, total, refresh } = useMembers({
    pageSize: 10,
    orderBy: "created_at",
    ascending: false,
  });

  const columns = [
    { header: "Member", accessor: "member_name" },
    { header: "Plan", accessor: "plan_name" },
    {
      header: "Status",
      accessor: "status",
      cell: (r) => <Badge tone={r.status === "active" ? "success" : "warning"}>{r.status ?? "unknown"}</Badge>,
    },
  ];

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 12 }}>
        <Card
          title="Memberships"
          action={
            <div style={{ display: "inline-flex", gap: 8 }}>
              <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
            </div>
          }
        >
          {loading && <Loader label="Loading memberships..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table
            columns={columns}
            data={Array.isArray(data) ? data : []}
            emptyMessage={loading ? "Loading..." : "No memberships found."}
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
