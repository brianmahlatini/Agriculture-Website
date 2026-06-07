// Auth section gives users a polished register/login flow without leaving the marketing page.
import { FormEvent, useState } from 'react';
import { LockKeyhole, UserPlus } from 'lucide-react';

type AuthSectionProps = {
  onRegister: (payload: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    company: string;
  }) => Promise<void>;
  onLogin: (payload: { identifier: string; password: string }) => Promise<void>;
};

export function AuthSection({ onRegister, onLogin }: AuthSectionProps) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const form = new FormData(event.currentTarget);

    try {
      await onRegister({
        username: String(form.get('username')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        fullName: String(form.get('fullName')),
        company: String(form.get('company'))
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const form = new FormData(event.currentTarget);

    try {
      await onLogin({
        identifier: String(form.get('identifier')),
        password: String(form.get('password'))
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section auth-section" id="access">
      <div className="section-copy">
        <p className="eyebrow">Secure workspaces</p>
        <h2>Register first to create the Agricore administrator account.</h2>
        <p>
          The first registered account becomes ADMIN automatically. Every later registration becomes
          a USER with booking, cancellation, and account workspace access.
        </p>
        <div className="auth-switch" aria-label="Authentication mode">
          <button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => setMode('register')}>
            <UserPlus size={17} /> Register
          </button>
          <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>
            <LockKeyhole size={17} /> Login
          </button>
        </div>
      </div>

      {mode === 'register' ? (
        <form className="partner-form auth-form" onSubmit={handleRegister}>
          <label>
            Full name
            <input name="fullName" type="text" minLength={2} required />
          </label>
          <label>
            Username
            <input name="username" type="text" minLength={3} required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Company
            <input name="company" type="text" minLength={2} required />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength={8} required />
          </label>
          <button className="primary-button form-button" type="submit" disabled={busy}>
            {busy ? 'Creating account' : 'Create secure account'}
          </button>
          {message && <p className="form-note error">{message}</p>}
        </form>
      ) : (
        <form className="partner-form auth-form" onSubmit={handleLogin}>
          <label>
            Username or email
            <input name="identifier" type="text" minLength={3} required />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength={8} required />
          </label>
          <button className="primary-button form-button" type="submit" disabled={busy}>
            {busy ? 'Signing in' : 'Sign in'}
          </button>
          {message && <p className="form-note error">{message}</p>}
        </form>
      )}
    </section>
  );
}

