import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ResetPassword() {
  const [pwd, setPwd] = useState("");
  const nav = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    alert("Password reset (stub).");
    nav("/auth/sign-in", { replace: true });
  }

  return (
    <div className="container" style={{ padding: 24, maxWidth: 440 }}>
      <Card title="Reset password">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Input id="password" label="New Password" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="••••••••" required />
          <Button type="submit" variant="secondary">Update password</Button>
        </form>
        <div style={{ marginTop: 12 }}>
          <Link to="/auth/sign-in">Back to sign in</Link>
        </div>
      </Card>
    </div>
  );
}
