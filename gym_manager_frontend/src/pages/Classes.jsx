import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useClasses } from "../hooks/useClasses";

export default function Classes() {
  const { data, loading, error, page, setPage, pageSize, total, refresh } = useClasses({
    pageSize: 10,
    orderBy: "start_time",
    ascending: true,
  });

  const columns = [
    { header: "Class", accessor: "title" },
    { header: "Trainer", accessor: "trainer_name" },
    { header: "Spots", accessor: "spots" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "open" ? "success" : "warning"}>{r.status ?? "unknown"}</Badge> },
  ];

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 12 }}>
        <Card
          title="Classes"
          action={<Button variant="ghost" onClick={refresh}>↻ Refresh</Button>}
        >
          {loading && <Loader label="Loading classes..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table
            columns={columns}
            data={Array.isArray(data) ? data : []}
            emptyMessage={loading ? "Loading..." : "No classes found."}
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
