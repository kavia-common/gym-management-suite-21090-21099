import React from "react";
import Card from "./Card";
import Table from "./Table";
import Input from "./Input";
import Button from "./Button";

/**
 * PUBLIC_INTERFACE
 * DataTable provides a composed table surface with a title, optional search, actions and underlying Table rendering.
 */
export default function DataTable({
  title,
  columns,
  data,
  emptyMessage = "No data.",
  onSearch,
  searchPlaceholder = "Search...",
  actions,
  loading = false,
  error = "",
}) {
  return (
    <Card
      title={title}
      action={
        <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          {onSearch && (
            <div style={{ width: 220 }}>
              <Input id={`${title || "data"}-search`} placeholder={searchPlaceholder} onChange={(e) => onSearch(e.target.value)} />
            </div>
          )}
          {actions}
        </div>
      }
    >
      {loading && (
        <div className="text-muted" style={{ padding: 8 }}>
          Loading...
        </div>
      )}
      {error && (
        <div className="text-muted" style={{ padding: 8, color: "var(--color-error)" }}>
          {error}
        </div>
      )}
      <Table columns={columns} data={Array.isArray(data) ? data : []} emptyMessage={emptyMessage} />
    </Card>
  );
}
