import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import PropertyDetails from './pages/PropertyDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PostProperty from './pages/PostProperty.jsx';
import MyListings from './pages/MyListings.jsx';
import Favourites from './pages/Favourites.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/favourites" element={<Favourites />} />
          </Route>
          <Route element={<ProtectedRoute roles={['seller', 'admin']} />}>
            <Route path="/post" element={<PostProperty />} />
            <Route path="/my-listings" element={<MyListings />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="footer">Real Estate Property Listing Portal – Smart Online Property Marketplace</footer>
    </>
  );
}
