import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../components/common/ToastProvider';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setInfo('');
    setError('');
    setSubmitting(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectTo = `${origin}/auth/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) {
        setError(resetError.message || 'Unable to send reset email.');
      } else {
        setInfo('If an account exists for that email, a reset link has been sent.');
        showToast('Password reset email sent (if account exists).', 'info');
      }
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: 24, maxWidth: 440 }}>
      <Card title="Forgot password">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <Input id="email" label="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          {error && <div className="text-muted" style={{ color: 'var(--color-error)' }}>{error}</div>}
          {info && <div className="text-muted" style={{ color: 'var(--color-text-muted)' }}>{info}</div>}
          <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send reset link'}</Button>
        </form>
        <div style={{ marginTop: 12 }}>
          <Link to="/auth/sign-in">Back to sign in</Link>
        </div>
      </Card>
    </div>
  );
}
