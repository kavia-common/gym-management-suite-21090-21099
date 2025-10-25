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
import { useBookings } from "../hooks/useBookings";

export default function Bookings() {
  const { data, loading, error, page, setPage, pageSize, total, refresh, create, update } = useBookings({
    pageSize: 10,
    orderBy: "created_at",
    ascending: false,
  });

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search) return data || [];
    const q = search.toLowerCase();
    return (data || []).filter(
      (r) =>
        String(r.member_name || "").toLowerCase().includes(q) ||
        String(r.class_title || "").toLowerCase().includes(q)
    );
  }, [search, data]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ member_name: "", class_title: "", status: "pending", scheduled_at: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function openCreate() {
    setForm({ member_name: "", class_title: "", status: "pending", scheduled_at: "" });
    setEditing(null);
    setFormError("");
    setOpen(true);
  }
  function openEdit(row) {
    setForm({
      member_name: row.member_name || "",
      class_title: row.class_title || "",
      status: row.status || "pending",
      scheduled_at: row.scheduled_at || "",
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
      setFormError(e?.message || "Failed to save booking.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { header: "Member", accessor: "member_name" },
    { header: "Class", accessor: "class_title" },
    { header: "Time", accessor: "scheduled_at" },
    { header: "Status", accessor: "status", cell: (r) => <Badge tone={r.status === "confirmed" ? "success" : "warning"}>{r.status ?? "pending"}</Badge> },
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
        <Card title="Bookings" action={
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 220 }}>
              <Input id="booking-search" placeholder="Search members or classes…" value={search} onChange={(e)=>setSearch(e.target.value)} />
            </div>
            <Button variant="secondary" onClick={openCreate}>+ New</Button>
            <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
          </div>
        }>
          {loading && <Loader label="Loading bookings..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table
            columns={columns}
            data={Array.isArray(filtered) ? filtered : []}
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

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={editing ? "Edit Booking" : "New Booking"}
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={submitting}>{submitting ? "Saving…" : "Save"}</Button>
            </>
          }
        >
          <div style={{ display: "grid", gap: 12 }}>
            <Input id="member_name" label="Member Name" value={form.member_name} onChange={(e)=>setForm({ ...form, member_name: e.target.value })} placeholder="Jane Doe" />
            <Input id="class_title" label="Class" value={form.class_title} onChange={(e)=>setForm({ ...form, class_title: e.target.value })} placeholder="HIIT" />
            <Input id="scheduled_at" label="Scheduled At" type="datetime-local" value={form.scheduled_at} onChange={(e)=>setForm({ ...form, scheduled_at: e.target.value })} />
            <Select
              id="status"
              label="Status"
              value={form.status}
              onChange={(e)=>setForm({ ...form, status: e.target.value })}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Canceled", value: "canceled" },
              ]}
            />
            {formError && <div className="text-muted" style={{ color: "var(--color-error)" }}>{formError}</div>}
          </div>
        </Modal>
      </div>
    </Shell>
  );
}
