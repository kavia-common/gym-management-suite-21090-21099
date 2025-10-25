import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../components/common/ToastProvider';

export default function ResetPassword() {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: pwd });
      if (updateError) {
        setError(updateError.message || 'Unable to update password.');
      } else {
        setInfo('Password updated. You can now sign in with your new password.');
        showToast('Password updated successfully.', 'success');
        setTimeout(() => nav('/auth/sign-in', { replace: true }), 1000);
      }
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ padding: 24, maxWidth: 440 }}>
      <Card title="Reset password">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <Input id="password" label="New Password" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="••••••••" required />
          {error && <div className="text-muted" style={{ color: 'var(--color-error)' }}>{error}</div>}
          {info && <div className="text-muted" style={{ color: 'var(--color-text-muted)' }}>{info}</div>}
          <Button type="submit" variant="secondary" disabled={submitting}>{submitting ? 'Updating...' : 'Update password'}</Button>
        </form>
        <div style={{ marginTop: 12 }}>
          <Link to="/auth/sign-in">Back to sign in</Link>
        </div>
      </Card>
    </div>
  );
}
