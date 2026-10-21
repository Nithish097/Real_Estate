import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api, formatPrice } from '../api/api.js';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user, favIds, toggleFavourite } = useAuth();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get(`/properties/${id}`).then(setProperty).catch((e) => setError(e.message));
  }, [id]);

  const sendInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inquiries', { propertyId: id, message });
      setMessage('');
      setNotice({ type: 'success', text: 'Inquiry sent. You can track it in the Favourites page.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  if (error) return <p className="alert error">{error}</p>;
  if (!property) return <p className="muted">Loading…</p>;

  const saved = favIds.includes(property._id);
  const mapQuery = encodeURIComponent(`${property.address || ''} ${property.city}`);

  return (
    <div className="details">
      <div>
        <div className="card">
          {property.imageUrl ? (
            <img className="big-img" src={property.imageUrl} alt={property.title} onError={(e) => (e.target.style.display = 'none')} />
          ) : (
            <div className="big-img placeholder">No image</div>
          )}
          <div className="card-body">
            <div className="title-row">
              <div>
                <h2>{property.title}</h2>
                <p className="muted">{property.address}, {property.city}</p>
              </div>
              <div className="price big">{formatPrice(property.price, property.listingType)}</div>
            </div>
            <p className="meta">
              <span>{property.propertyType}</span>
              {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
              {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
              <span>{property.area} sq ft</span>
            </p>
            <div>{property.amenities.map((a) => <span className="chip" key={a}>{a}</span>)}</div>
            <h3>Description</h3>
            <p>{property.description || 'No description given.'}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="card card-body">
          <h3>Location on Map</h3>
          <iframe
            title="map"
            className="map"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
          />
        </div>

        <div className="card card-body">
          <h3>Contact Owner</h3>
          <p className="muted">Posted by {property.owner?.name}</p>
          {user ? (
            <form onSubmit={sendInquiry}>
              <textarea
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I am interested in this property…"
              />
              {notice.text && <p className={`alert ${notice.type}`}>{notice.text}</p>}
              <div className="row">
                <button className="btn" type="submit">Send Inquiry</button>
                <button className="btn btn-outline" type="button" onClick={() => toggleFavourite(property._id)}>
                  {saved ? '♥ Saved' : '♡ Save'}
                </button>
              </div>
            </form>
          ) : (
            <p><Link to="/login">Log in</Link> to send an inquiry or save this property.</p>
          )}
        </div>
      </div>
    </div>
  );
}
