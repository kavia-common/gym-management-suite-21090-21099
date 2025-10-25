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
import { useMembers } from "../hooks/useMembers";

export default function Memberships() {
  const { data, loading, error, page, setPage, pageSize, total, refresh, create, update } = useMembers({
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
        String(r.plan_name || "").toLowerCase().includes(q)
    );
  }, [search, data]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ member_name: "", plan_name: "", status: "active" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function openCreate() {
    setForm({ member_name: "", plan_name: "", status: "active" });
    setEditing(null);
    setFormError("");
    setOpen(true);
  }
  function openEdit(row) {
    setForm({ member_name: row.member_name || "", plan_name: row.plan_name || "", status: row.status || "active" });
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
      setFormError(e?.message || "Failed to save membership.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { header: "Member", accessor: "member_name" },
    { header: "Plan", accessor: "plan_name" },
    {
      header: "Status",
      accessor: "status",
      cell: (r) => <Badge tone={r.status === "active" ? "success" : "warning"}>{r.status ?? "unknown"}</Badge>,
    },
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
          title="Memberships"
          action={
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 220 }}>
                <Input id="member-search" placeholder="Search members or plans…" value={search} onChange={(e)=>setSearch(e.target.value)} />
              </div>
              <Button variant="secondary" onClick={openCreate}>+ New</Button>
              <Button variant="ghost" onClick={refresh}>↻ Refresh</Button>
            </div>
          }
        >
          {loading && <Loader label="Loading memberships..." />}
          {error && <div className="text-muted" style={{ color: "var(--color-error)", marginBottom: 8 }}>{error}</div>}
          <Table
            columns={columns}
            data={Array.isArray(filtered) ? filtered : []}
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

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={editing ? "Edit Membership" : "New Membership"}
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={submitting}>{submitting ? "Saving…" : "Save"}</Button>
            </>
          }
        >
          <div style={{ display: "grid", gap: 12 }}>
            <Input id="member_name" label="Member Name" value={form.member_name} onChange={(e)=>setForm({ ...form, member_name: e.target.value })} placeholder="Jane Doe" />
            <Input id="plan_name" label="Plan" value={form.plan_name} onChange={(e)=>setForm({ ...form, plan_name: e.target.value })} placeholder="Gold" />
            <Select
              id="status"
              label="Status"
              value={form.status}
              onChange={(e)=>setForm({ ...form, status: e.target.value })}
              options={[
                { label: "Active", value: "active" },
                { label: "Paused", value: "paused" },
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
