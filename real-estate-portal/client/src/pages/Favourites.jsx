import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { api } from '../api/api.js';

export default function Favourites() {
  const { favIds } = useAuth();
  const [tab, setTab] = useState('saved');
  const [saved, setSaved] = useState([]);
  const [sent, setSent] = useState([]);
  const [error, setError] = useState('');

  // reload the saved list when a heart is toggled (favIds changes)
  useEffect(() => {
    api.get('/favourites').then(setSaved).catch((e) => setError(e.message));
  }, [favIds]);

  useEffect(() => {
    api.get('/inquiries/sent').then(setSent).catch(() => {});
  }, []);

  return (
    <>
      <div className="tabs">
        <button className={`btn ${tab === 'saved' ? '' : 'btn-outline'}`} onClick={() => setTab('saved')}>
          Saved Properties ({saved.length})
        </button>
        <button className={`btn ${tab === 'inquiries' ? '' : 'btn-outline'}`} onClick={() => setTab('inquiries')}>
          My Inquiries ({sent.length})
        </button>
      </div>
      {error && <p className="alert error">{error}</p>}

      {tab === 'saved' && (
        <>
          {saved.length === 0 && <p className="muted">You have not saved any property yet.</p>}
          <div className="grid">{saved.map((p) => <PropertyCard key={p._id} property={p} />)}</div>
        </>
      )}

      {tab === 'inquiries' && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Property</th><th>Owner</th><th>Your message</th><th>Status</th><th>Reply</th></tr>
            </thead>
            <tbody>
              {sent.length === 0 && <tr><td colSpan="5" className="muted">You have not sent any inquiry yet.</td></tr>}
              {sent.map((q) => (
                <tr key={q._id}>
                  <td>{q.property?.title}</td>
                  <td>{q.owner?.name}</td>
                  <td>{q.message}</td>
                  <td><span className={`badge ${q.status === 'replied' ? 'approved' : 'pending'}`}>{q.status}</span></td>
                  <td>{q.reply || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
