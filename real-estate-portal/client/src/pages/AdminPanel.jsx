import { useEffect, useState } from 'react';
import { api, formatPrice } from '../api/api.js';

export default function AdminPanel() {
  const [stats, setStats] = useState({ totalListings: 0, pendingListings: 0, users: 0, inquiries: 0 });
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/admin/stats').then(setStats).catch((e) => setError(e.message));
    api.get('/admin/pending').then(setPending).catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const decide = async (id, status) => {
    try {
      await api.put(`/admin/properties/${id}/status`, { status });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>Admin Panel</h2>
      {error && <p className="alert error">{error}</p>}

      <div className="stats">
        <div className="card card-body"><span className="muted">Total Listings</span><strong>{stats.totalListings}</strong></div>
        <div className="card card-body"><span className="muted">Pending Approval</span><strong className="warn">{stats.pendingListings}</strong></div>
        <div className="card card-body"><span className="muted">Registered Users</span><strong>{stats.users}</strong></div>
        <div className="card card-body"><span className="muted">Inquiries</span><strong>{stats.inquiries}</strong></div>
      </div>

      <h3>Listings waiting for approval</h3>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>Listing</th><th>Posted By</th><th>City</th><th>Price</th><th>Action</th></tr>
          </thead>
          <tbody>
            {pending.length === 0 && <tr><td colSpan="5" className="muted">No listings are waiting for approval.</td></tr>}
            {pending.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.owner?.name}</td>
                <td>{p.city}</td>
                <td>{formatPrice(p.price, p.listingType)}</td>
                <td className="row">
                  <button className="btn btn-green btn-sm" onClick={() => decide(p._id, 'approved')}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => decide(p._id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
