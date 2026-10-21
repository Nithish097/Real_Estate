import { useState } from 'react';

const TYPES = ['Apartment', 'House', 'Villa', 'Plot', 'Studio'];
const PRICES = [
  { label: 'Any price', value: '' },
  { label: 'Up to ₹ 20,000', value: 20000 },
  { label: 'Up to ₹ 10 Lakh', value: 1000000 },
  { label: 'Up to ₹ 50 Lakh', value: 5000000 },
  { label: 'Up to ₹ 1 Crore', value: 10000000 },
];

export default function SearchBar({ initial, onSearch }) {
  const [f, setF] = useState(initial);
  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSearch(f);
  };

  const reset = () => {
    const empty = { city: '', propertyType: '', listingType: '', maxPrice: '', beds: '' };
    setF(empty);
    onSearch(empty);
  };

  return (
    <form className="card search-bar" onSubmit={submit}>
      <div>
        <label>City / Area</label>
        <input name="city" value={f.city} onChange={change} placeholder="e.g. Salem" />
      </div>
      <div>
        <label>Buy / Rent</label>
        <select name="listingType" value={f.listingType} onChange={change}>
          <option value="">Buy or Rent</option>
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>
      </div>
      <div>
        <label>Property Type</label>
        <select name="propertyType" value={f.propertyType} onChange={change}>
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label>Max Price</label>
        <select name="maxPrice" value={f.maxPrice} onChange={change}>
          {PRICES.map((p) => <option key={p.label} value={p.value}>{p.label}</option>)}
        </select>
      </div>
      <div>
        <label>Bedrooms</label>
        <select name="beds" value={f.beds} onChange={change}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>
      <div className="search-actions">
        <button className="btn" type="submit">Search</button>
        <button className="btn btn-outline" type="button" onClick={reset}>Reset</button>
      </div>
    </form>
  );
}
