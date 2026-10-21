import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card card-body form-narrow" onSubmit={submit}>
      <h2>Create Account</h2>
      {error && <p className="alert error">{error}</p>}
      <label>Full Name</label>
      <input name="name" required value={form.name} onChange={change} />
      <label>Email</label>
      <input name="email" type="email" required value={form.email} onChange={change} />
      <label>Password (minimum 6 characters)</label>
      <input name="password" type="password" required minLength="6" value={form.password} onChange={change} />
      <label>I am a</label>
      <select name="role" value={form.role} onChange={change}>
        <option value="buyer">Buyer / Tenant</option>
        <option value="seller">Owner / Agent (post properties)</option>
      </select>
      <button className="btn" type="submit">Register</button>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
