import React, { useMemo, useState } from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Modal from "../components/common/Modal";
import { useClasses } from "../hooks/useClasses";
import { useTrainers } from "../hooks/useTrainers";

export default function Classes() {
  const { data, loading, error, page, setPage, pageSize, total, refresh, create, update } = useClasses({
    pageSize: 10,
    orderBy: "start_time",
    ascending: true,
  });
  const trainers = useTrainers({ pageSize: 50 });

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search) return data || [];
    const q = search.toLowerCase();
    return (data || []).filter(
      (r) =>
        String(r.title || "").toLowerCase().includes(q) ||
        String(r.trainer_name || "").toLowerCase().includes(q)
    );
  }, [search, data]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", trainer_id: "", spots: 10, status: "open", start_time: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function openCreate() {
    setForm({ title: "", trainer_id: "", spots: 10, status: "open", start_time: "" });
    setEditing(null);
    setFormError("");
    setOpen(true);
  }
  function openEdit(row) {
    setForm({
      title: row.title || "",
      trainer_id: row.trainer_id || "",
      spots: row.spots || 10,
      status: row.status || "open",
      start_time: row.start_time || "",
    });
    setEditing(row);
    setFormError("");
    setOpen(true);
  }

  async function handleSave() {
    setSubmitting(true);
    setFormError("");
    try {
      if (editing?.id) {
        await update(editing.id, form);
      } else {
        await create(form);
      }
      setOpen(false);
    } catch (e) {
      setFormError(e?.message || "Failed to save class.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { header: "Class", accessor: "title" },
    { header: "Trainer", accessor: "trainer_name" },
    { header: "Spots", accessor: "spots" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "open" ? "success" : "warning"}>{r.status ?? "unknown"}</Badge> },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => (
        <div style={{ display: "inline-flex", gap: 8 }}>
          <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
        </div>
      ),
    },
  ];

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 12 }}>
        <Card
          title="Classes"
          action={
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 220 }}>
                <Input id="class-search" placeholder="Search classes or trainers…" value={search} onChange={(e)=>setSearch(e.target.value)} />
              </div>
              <Button variant="secondary" onClick={openCreate}>+ New</Button>
              <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
            </div>
          }
        >
          {loading && <Loader label="Loading classes..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table
            columns={columns}
            data={Array.isArray(filtered) ? filtered : []}
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

        <Card title="Schedule (Placeholder)">
          <div
            className="card-surface"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 8,
              padding: 8,
              background: "#fbfdff",
              border: "1px dashed var(--color-border)",
            }}
          >
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
              <div key={d} style={{ minHeight: 80, padding: 8, border: "1px solid var(--color-border)", borderRadius: 8 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{d}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>Drag classes here (soon)</div>
              </div>
            ))}
          </div>
        </Card>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={editing ? "Edit Class" : "New Class"}
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={submitting}>{submitting ? "Saving…" : "Save"}</Button>
            </>
          }
        >
          <div style={{ display: "grid", gap: 12 }}>
            <Input id="title" label="Title" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} placeholder="HIIT" />
            <Input id="start_time" label="Start Time" type="datetime-local" value={form.start_time} onChange={(e)=>setForm({ ...form, start_time: e.target.value })} />
            <Input id="spots" label="Spots" type="number" value={form.spots} onChange={(e)=>setForm({ ...form, spots: Number(e.target.value) })} />
            <Select
              id="status"
              label="Status"
              value={form.status}
              onChange={(e)=>setForm({ ...form, status: e.target.value })}
              options={[
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" },
                { label: "Canceled", value: "canceled" },
              ]}
            />
            <Select
              id="trainer_id"
              label="Trainer"
              value={form.trainer_id || ""}
              onChange={(e)=>setForm({ ...form, trainer_id: e.target.value })}
              options={[
                { label: "Unassigned", value: "" },
                ...(Array.isArray(trainers.data) ? trainers.data : []).map((t) => ({ label: t.name || `#${t.id}`, value: t.id })),
              ]}
            />
            {formError && <div className="text-muted" style={{ color: "var(--color-error)" }}>{formError}</div>}
          </div>
        </Modal>
      </div>
    </Shell>
  );
}
