import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isSeller = user && (user.role === 'seller' || user.role === 'admin');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        REAL ESTATE PORTAL
        <small>Smart Online Property Marketplace</small>
      </Link>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        {isSeller && <NavLink to="/post">Post Property</NavLink>}
        {isSeller && <NavLink to="/my-listings">My Listings</NavLink>}
        {user && <NavLink to="/favourites">Favourites</NavLink>}
        {user && user.role === 'admin' && <NavLink to="/admin">Admin Panel</NavLink>}
        {user ? (
          <>
            <span className="hello">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn btn-light" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn btn-light">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
