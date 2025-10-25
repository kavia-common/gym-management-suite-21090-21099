import React, { useMemo, useState } from "react";
import Shell from "../components/layout/Shell";
import Card from "../components/common/Card";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Modal from "../components/common/Modal";
import { useTrainers } from "../hooks/useTrainers";
import { useToast } from "../components/common/ToastProvider";

export default function Trainers() {
  const { data, loading, error, page, setPage, pageSize, total, refresh, create, update, remove } = useTrainers({
    pageSize: 10,
    orderBy: "name",
    ascending: true,
  });
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search) return data || [];
    const q = search.toLowerCase();
    return (data || []).filter(
      (r) => String(r.name || "").toLowerCase().includes(q) || String(r.specialty || "").toLowerCase().includes(q)
    );
  }, [search, data]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", specialty: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function openCreate() {
    setForm({ name: "", specialty: "", rating: 5 });
    setEditing(null);
    setFormError("");
    setOpen(true);
  }
  function openEdit(row) {
    setForm({ name: row.name || "", specialty: row.specialty || "", rating: row.rating || 5 });
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
        showToast("Trainer updated.", "success");
      } else {
        await create(form);
        showToast("Trainer created.", "success");
      }
      setOpen(false);
    } catch (e) {
      const msg = e?.message || "Failed to save trainer.";
      setFormError(msg);
      showToast(msg, "danger");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row) {
    try {
      await remove(row.id);
      showToast("Trainer removed.", "success");
    } catch (e) {
      showToast(e?.message || "Failed to remove trainer.", "danger");
    }
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Specialty", accessor: "specialty" },
    { header: "Rating", accessor: "rating" },
    {
      header: "Actions",
      accessor: "__actions",
      cell: (r) => (
        <div style={{ display: "inline-flex", gap: 8 }}>
          <Button variant="ghost" onClick={() => openEdit(r)}>Edit</Button>
          <Button variant="ghost" onClick={() => handleDelete(r)}>Remove</Button>
        </div>
      ),
    },
  ];

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  return (
    <Shell>
      <div className="container" style={{ padding: 16, display: "grid", gap: 12 }}>
        <Card title="Trainers" action={
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 220 }}>
              <Input id="trainer-search" placeholder="Search trainers…" value={search} onChange={(e)=>setSearch(e.target.value)} />
            </div>
            <Button variant="secondary" onClick={openCreate}>+ New</Button>
            <Button variant="ghost" onClick={() => { refresh(); showToast("Refreshed.", "info"); }}>↻ Refresh</Button>
          </div>
        }>
          {loading && <Loader label="Loading trainers..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table columns={columns} data={Array.isArray(filtered) ? filtered : []} emptyMessage={loading ? "Loading..." : "No trainers found."} />
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

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={editing ? "Edit Trainer" : "New Trainer"}
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={submitting}>{submitting ? "Saving…" : "Save"}</Button>
            </>
          }
        >
          <div style={{ display: "grid", gap: 12 }}>
            <Input id="name" label="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} placeholder="Alex Coach" />
            <Input id="specialty" label="Specialty" value={form.specialty} onChange={(e)=>setForm({ ...form, specialty: e.target.value })} placeholder="Strength, HIIT, Yoga…" />
            <Select
              id="rating"
              label="Rating"
              value={String(form.rating)}
              onChange={(e)=>setForm({ ...form, rating: Number(e.target.value) })}
              options={[
                { label: "5", value: "5" },
                { label: "4", value: "4" },
                { label: "3", value: "3" },
                { label: "2", value: "2" },
                { label: "1", value: "1" },
              ]}
            />
            {formError && <div className="text-muted" style={{ color: "var(--color-error)" }}>{formError}</div>}
          </div>
        </Modal>
      </div>
    </Shell>
  );
}
