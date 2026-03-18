import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import AdminLogin from './pages/admin/AdminLogin.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import ProductsManager from './pages/admin/ProductsManager.tsx';
import OrdersManager from './pages/admin/OrdersManager.tsx';
import PromotionsManager from './pages/admin/PromotionsManager.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="promotions" element={<PromotionsManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
