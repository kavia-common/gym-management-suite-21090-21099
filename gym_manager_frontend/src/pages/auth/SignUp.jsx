import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../routes";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const auth = useAuth();
  const nav = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    auth.signIn();
    nav("/", { replace: true });
  }

  return (
    <div className="container" style={{ padding: 24, maxWidth: 440 }}>
      <Card title="Create your account">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Input id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input id="password" label="Password" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="••••••••" required />
          <Button type="submit" variant="secondary">Sign Up</Button>
        </form>
        <div style={{ marginTop: 12 }}>
          Already have an account? <Link to="/auth/sign-in">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}
