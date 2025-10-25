import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../components/common/ToastProvider';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      showToast(error.message || 'Failed to sign in', 'error');
      return;
    }
    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Sign In</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <Button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign In'}</Button>
      </form>
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <Link to="/auth/forgot-password">Forgot password?</Link>
        <Link to="/auth/sign-up">Create account</Link>
      </div>
    </div>
  );
}
