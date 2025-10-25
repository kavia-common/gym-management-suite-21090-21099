import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("Password reset link sent (stub).");
  }

  return (
    <div className="container" style={{ padding: 24, maxWidth: 440 }}>
      <Card title="Forgot password">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Input id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          <Button type="submit">Send reset link</Button>
        </form>
        <div style={{ marginTop: 12 }}>
          <Link to="/auth/sign-in">Back to sign in</Link>
        </div>
      </Card>
    </div>
  );
}
