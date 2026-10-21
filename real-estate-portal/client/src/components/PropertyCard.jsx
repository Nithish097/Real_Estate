import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../api/api.js';

export default function PropertyCard({ property }) {
  const { user, favIds, toggleFavourite } = useAuth();
  const navigate = useNavigate();
  const saved = favIds.includes(property._id);

  const onHeart = async (e) => {
    e.preventDefault(); // do not open the details page
    if (!user) return navigate('/login');
    try {
      await toggleFavourite(property._id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Link to={`/property/${property._id}`} className="card property-card">
      <div className="thumb">
        {property.imageUrl ? (
          <img src={property.imageUrl} alt={property.title} onError={(e) => (e.target.style.display = 'none')} />
        ) : null}
        <span className="tag">{property.listingType === 'sale' ? 'For Sale' : 'For Rent'}</span>
        <button className={`heart ${saved ? 'on' : ''}`} onClick={onHeart} title="Save to favourites">
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="card-body">
        <div className="price">{formatPrice(property.price, property.listingType)}</div>
        <h3>{property.title}</h3>
        <p className="muted">{property.address || property.city}, {property.city}</p>
        <p className="meta">
          {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
          {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
          <span>{property.area} sq ft</span>
        </p>
      </div>
    </Link>
  );
}
