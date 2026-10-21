import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card card-body form-narrow" onSubmit={submit}>
      <h2>Login</h2>
      {error && <p className="alert error">{error}</p>}
      <label>Email</label>
      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <label>Password</label>
      <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn" type="submit">Login</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      <p className="muted small">Demo: buyer@realestate.com / password123</p>
    </form>
  );
}
