import React from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useTrainers } from "../hooks/useTrainers";

export default function Trainers() {
  const { data, loading, error, page, setPage, pageSize, total, refresh } = useTrainers({
    pageSize: 10,
    orderBy: "name",
    ascending: true,
  });

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Specialty", accessor: "specialty" },
    { header: "Rating", accessor: "rating" },
  ];

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 12 }}>
        <Card title="Trainers" action={<Button variant="ghost" onClick={refresh}>↻ Refresh</Button>}>
          {loading && <Loader label="Loading trainers..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table columns={columns} data={Array.isArray(data) ? data : []} emptyMessage={loading ? "Loading..." : "No trainers found."} />
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
