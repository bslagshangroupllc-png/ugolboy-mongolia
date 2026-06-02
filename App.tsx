import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { PublicLayout, AdminLayout } from './components/Layout';
import { Login } from './pages/Auth';
import { ProductList, ProductDetail } from './pages/ProductPages';
import { MyOrders, WishlistPage, NotificationsPage, CartPage } from './pages/BuyerDashboard';
import { AdminDashboard, AdminOrderList, AdminInvoiceList, CompanyManagement } from './pages/AdminDashboard';
import { AdminProductManagement } from './pages/AdminProductManagement';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles: string[] }) => {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Public & Buyer Routes (Wrapped in Public Layout) */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><ProductList /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        
        {/* Buyer Only */}
        <Route path="/wishlist" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <PublicLayout><WishlistPage /></PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <PublicLayout><CartPage /></PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/my/orders" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <PublicLayout><MyOrders /></PublicLayout>
          </ProtectedRoute>
        } />
         <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <PublicLayout><NotificationsPage /></PublicLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes (Wrapped in Admin Layout) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminOrderList /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/invoices" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminInvoiceList /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminProductManagement /></AdminLayout> 
          </ProtectedRoute>
        } />
         <Route path="/admin/companies" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><CompanyManagement /></AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
};

const Home = () => (
  <div className="relative bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-serif font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">The Finest</span>{' '}
              <span className="block text-primary-600 xl:inline">Mongolian Cashmere</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Ethically sourced, sustainably made. We provide premium cashmere wholesale solutions for boutique brands worldwide.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <a href="#/products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800 md:py-4 md:text-lg md:px-10">
                  View Collection
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://picsum.photos/1000/800?grayscale" alt="Cashmere texture" />
    </div>
  </div>
);

const App = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;