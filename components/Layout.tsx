import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { ShoppingBag, Heart, LogOut, Menu, User as UserIcon, Bell, LayoutDashboard, Package, Users, FileText, FileSpreadsheet } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout, notifications, cart } = useStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.isRead && n.userId === currentUser?.id).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-2xl font-bold text-primary-800 tracking-tight">Goyol Cashmere</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Collection
              </Link>
              {currentUser?.role === 'buyer' && (
                <>
                  <Link to="/my/orders" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    My Orders
                  </Link>
                </>
              )}
              {currentUser?.role === 'admin' && (
                <>
                  <Link to="/admin" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Admin Panel
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {currentUser.role === 'buyer' && (
                  <>
                    <Link to="/wishlist" className="p-2 text-gray-400 hover:text-gray-500">
                      <Heart className="h-6 w-6" />
                    </Link>
                    <Link to="/cart" className="relative p-2 text-gray-400 hover:text-gray-500">
                      <ShoppingBag className="h-6 w-6" />
                      {cart.length > 0 && (
                        <span className="absolute top-1 right-1 block h-4 w-4 text-[10px] text-center leading-4 rounded-full bg-primary-600 text-white ring-2 ring-white">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <div className="relative p-2 text-gray-400 hover:text-gray-500 cursor-pointer">
                  <Bell className="h-6 w-6" onClick={() => navigate('/notifications')} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </div>
                <div className="flex items-center ml-2">
                  <span className="text-sm font-medium text-gray-700 mr-2 hidden md:block">{currentUser.name}</span>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-500">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium text-sm">
                Partner Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { logout } = useStore();
  const navigate = useNavigate();

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: FileText },
    { name: 'Invoices', path: '/admin/invoices', icon: FileSpreadsheet },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Companies', path: '/admin/companies', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary-900 text-white flex-shrink-0">
        <div className="h-16 flex items-center px-6 bg-primary-950 font-serif text-2xl font-bold">
          Goyol Cashmere Admin
        </div>
        <div className="py-4 space-y-1">
          {menu.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium ${location.pathname === item.path ? 'bg-primary-800 text-white' : 'text-primary-100 hover:bg-primary-800'}`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center text-primary-200 hover:text-white text-sm">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export const PublicLayout = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400 text-sm">
          &copy; 2023 Lusso Cashmere. Wholesale Only.
        </p>
      </div>
    </footer>
  </div>
);