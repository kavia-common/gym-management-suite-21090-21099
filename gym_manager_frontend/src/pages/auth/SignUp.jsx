import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../routes";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signUpWithPassword } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      let origin = "/";
      try {
        origin = window.location.origin || "/";
      } catch (_) {
        origin = "/";
      }
      const emailRedirectTo = `${origin}/auth/reset-password`;
      const { error: signUpError } = await signUpWithPassword(email, pwd, emailRedirectTo);
      if (signUpError) {
        setError(signUpError.message || "Unable to sign up.");
      } else {
        setInfo("Check your email to confirm your account. You will be redirected after verification.");
        // Optional navigate: keep user on page with info, or navigate to sign-in.
        // nav("/auth/sign-in", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unexpected error during sign up.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: 24, maxWidth: 440 }}>
      <Card title="Create your account">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <Input id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          <Input id="password" label="Password" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="••••••••" required />
          {error && <div className="text-muted" style={{ color: "var(--color-error)" }}>{error}</div>}
          {info && <div className="text-muted" style={{ color: "var(--color-text-muted)" }}>{info}</div>}
          <Button type="submit" variant="secondary" disabled={submitting}>{submitting ? "Creating..." : "Sign Up"}</Button>
        </form>
        <div style={{ marginTop: 12 }}>
          Already have an account? <Link to="/auth/sign-in">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}
