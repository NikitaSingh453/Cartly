import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar        from './components/Navbar';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Catalog       from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Orders        from './pages/Orders';
import ManageProduct from './pages/ManageProduct';

function RequireAuth({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/catalog" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/dashboard' : '/catalog'} /> : <Login />} />
          <Route path="/catalog"           element={<Catalog />} />
          <Route path="/products/new"      element={<RequireAuth adminOnly><ManageProduct /></RequireAuth>} />
          <Route path="/products/:id/edit" element={<RequireAuth adminOnly><ManageProduct /></RequireAuth>} />
          <Route path="/products/:id"      element={<ProductDetail />} />
          <Route path="/dashboard"         element={<RequireAuth adminOnly><Dashboard /></RequireAuth>} />
          <Route path="/cart"              element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/orders"            element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="*"                  element={<Navigate to="/catalog" />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
