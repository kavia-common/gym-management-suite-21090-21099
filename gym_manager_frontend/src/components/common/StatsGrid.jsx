import React from "react";
import Card from "./Card";

/**
 * PUBLIC_INTERFACE
 * StatsGrid renders a responsive grid of small KPI cards with title, value, and optional subtitle or action.
 */
export default function StatsGrid({ items = [] }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {items.map((kpi, idx) => (
        <Card
          key={kpi.key || idx}
          title={kpi.title}
          action={kpi.action}
          style={{ padding: 14 }}
          footer={
            kpi.subtitle ? (
              <div className="text-muted" style={{ fontSize: 12 }}>{kpi.subtitle}</div>
            ) : null
          }
        >
          <div style={{ fontSize: 24, fontWeight: 800 }}>{kpi.value}</div>
        </Card>
      ))}
    </div>
  );
}
