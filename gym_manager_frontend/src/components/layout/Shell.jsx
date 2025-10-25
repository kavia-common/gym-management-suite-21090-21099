import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * PUBLIC_INTERFACE
 * Application shell providing sidebar, topbar and content area.
 */
export default function Shell({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main className="container" style={{ padding: 16, display: "grid", gap: 16 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
