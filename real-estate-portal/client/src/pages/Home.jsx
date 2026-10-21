import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { api } from '../api/api.js';

const EMPTY = { city: '', propertyType: '', listingType: '', maxPrice: '', beds: '' };

export default function Home() {
  const [filters, setFilters] = useState(EMPTY);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // fetch the list again whenever filters, sort order or page change
  useEffect(() => {
    const params = new URLSearchParams({ sort, page });
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));

    setLoading(true);
    api
      .get(`/properties?${params.toString()}`)
      .then((res) => {
        setData(res);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters, sort, page]);

  const handleSearch = (f) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <>
      <section className="hero">
        <h1>Find your next property</h1>
        <p>Search verified listings to buy or rent</p>
      </section>

      <SearchBar initial={filters} onSearch={handleSearch} />

      <div className="list-head">
        <strong>{data.total} properties found</strong>
        <label>
          Sort by:{' '}
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </div>

      {error && <p className="alert error">{error}. Is the server running?</p>}
      {loading && <p className="muted">Loading…</p>}
      {!loading && !error && data.items.length === 0 && <p className="muted">No properties match your search.</p>}

      <div className="grid">
        {data.items.map((p) => <PropertyCard key={p._id} property={p} />)}
      </div>

      {data.pages > 1 && (
        <div className="pager">
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {data.pages}</span>
          <button className="btn btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
