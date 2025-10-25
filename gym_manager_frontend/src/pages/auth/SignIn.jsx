import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../routes";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signInWithPassword } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { error: signInError } = await signInWithPassword(email, pwd);
      if (signInError) {
        setError(signInError.message || "Unable to sign in. Please check your credentials.");
      } else {
        nav(redirect, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unexpected error during sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: 24, maxWidth: 440 }}>
      <Card title="Sign in to Gym Manager">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Input id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input id="password" label="Password" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="••••••••" required />
          {error && <div className="text-muted" style={{ color: "var(--color-error)" }}>{error}</div>}
          <Button type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign In"}</Button>
        </form>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
          <Link to="/auth/forgot-password">Forgot password?</Link>
          <Link to="/auth/sign-up">Create account</Link>
        </div>
      </Card>
    </div>
  );
}
