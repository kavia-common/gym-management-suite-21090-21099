import React from "react";

/**
 * PUBLIC_INTERFACE
 * Simple table with headers and rows.
 */
export default function Table({ columns = [], data = [], rowKey = "id", emptyMessage = "No data." }) {
  return (
    <div className="card-surface" style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key || c.accessor}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-muted" style={{ padding: 16 }}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={row[rowKey] ?? JSON.stringify(row)}>
              {columns.map((c) => (
                <td key={c.key || c.accessor}>
                  {typeof c.cell === "function" ? c.cell(row) : row[c.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
