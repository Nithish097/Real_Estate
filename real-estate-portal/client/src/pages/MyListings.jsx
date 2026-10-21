import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api/api.js';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [replies, setReplies] = useState({});
  const [error, setError] = useState('');

  const load = () => {
    api.get('/properties/mine').then(setListings).catch((e) => setError(e.message));
    api.get('/inquiries/received').then(setInquiries).catch(() => {});
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.del(`/properties/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const sendReply = async (id) => {
    try {
      await api.put(`/inquiries/${id}/reply`, { reply: replies[id] });
      setReplies({ ...replies, [id]: '' });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>My Listings</h2>
      {error && <p className="alert error">{error}</p>}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>Title</th><th>City</th><th>Price</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {listings.length === 0 && <tr><td colSpan="5" className="muted">You have not posted any property yet.</td></tr>}
            {listings.map((p) => (
              <tr key={p._id}>
                <td>{p.status === 'approved' ? <Link to={`/property/${p._id}`}>{p.title}</Link> : p.title}</td>
                <td>{p.city}</td>
                <td>{formatPrice(p.price, p.listingType)}</td>
                <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                <td><button className="btn btn-danger btn-sm" onClick={() => remove(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Inquiries Received</h2>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>Property</th><th>From</th><th>Message</th><th>Reply</th></tr>
          </thead>
          <tbody>
            {inquiries.length === 0 && <tr><td colSpan="4" className="muted">No inquiries yet.</td></tr>}
            {inquiries.map((q) => (
              <tr key={q._id}>
                <td>{q.property?.title}</td>
                <td>{q.buyer?.name}<br /><span className="muted small">{q.buyer?.email}</span></td>
                <td>{q.message}</td>
                <td>
                  {q.status === 'replied' ? (
                    <span className="badge approved">Replied: {q.reply}</span>
                  ) : (
                    <div className="row">
                      <input
                        value={replies[q._id] || ''}
                        onChange={(e) => setReplies({ ...replies, [q._id]: e.target.value })}
                        placeholder="Write a reply"
                      />
                      <button className="btn btn-sm" onClick={() => sendReply(q._id)}>Send</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
