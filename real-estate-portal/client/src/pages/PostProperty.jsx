import { useState } from 'react';
import { api } from '../api/api.js';

const AMENITIES = ['Parking', 'Lift', 'Security', 'Power Backup', 'Water Supply', 'Gym', 'Garden'];
const START = {
  title: '', listingType: 'sale', propertyType: 'Apartment', price: '', city: '', address: '',
  bedrooms: 2, bathrooms: 2, area: '', imageUrl: '', description: '', amenities: [],
};

export default function PostProperty() {
  const [form, setForm] = useState(START);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAmenity = (name) =>
    setForm({
      ...form,
      amenities: form.amenities.includes(name)
        ? form.amenities.filter((a) => a !== name)
        : [...form.amenities, name],
    });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/properties', {
        ...form,
        price: Number(form.price),
        area: Number(form.area) || 0,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      });
      setForm(START);
      setNotice({ type: 'success', text: 'Listing submitted. It will appear after admin approval.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  return (
    <form className="card card-body" onSubmit={submit}>
      <h2>Post a New Property</h2>
      {notice.text && <p className={`alert ${notice.type}`}>{notice.text}</p>}

      <div className="form-grid">
        <div className="span2">
          <label>Property Title</label>
          <input name="title" required value={form.title} onChange={change} placeholder="3 BHK Apartment in Fairlands" />
        </div>
        <div>
          <label>Listing For</label>
          <select name="listingType" value={form.listingType} onChange={change}>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div>
          <label>Property Type</label>
          <select name="propertyType" value={form.propertyType} onChange={change}>
            {['Apartment', 'House', 'Villa', 'Plot', 'Studio'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label>Price (₹) {form.listingType === 'rent' && '– per month'}</label>
          <input name="price" type="number" min="1" required value={form.price} onChange={change} />
        </div>
        <div>
          <label>City</label>
          <input name="city" required value={form.city} onChange={change} />
        </div>
        <div className="span2">
          <label>Address</label>
          <input name="address" value={form.address} onChange={change} />
        </div>
        <div>
          <label>Area (sq ft)</label>
          <input name="area" type="number" min="0" value={form.area} onChange={change} />
        </div>
        <div>
          <label>Bedrooms</label>
          <input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={change} />
        </div>
        <div>
          <label>Bathrooms</label>
          <input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={change} />
        </div>
        <div className="span3">
          <label>Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={change} placeholder="https://…/photo.jpg" />
        </div>
        <div className="span3">
          <label>Amenities</label>
          {AMENITIES.map((a) => (
            <label key={a} className="check">
              <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} /> {a}
            </label>
          ))}
        </div>
        <div className="span3">
          <label>Description</label>
          <textarea name="description" rows="4" value={form.description} onChange={change} />
        </div>
      </div>

      <button className="btn" type="submit">Submit for Approval</button>
    </form>
  );
}
