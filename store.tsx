import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Company, Product, ProductPrice, CompanyProductVisibility, 
  Order, OrderItem, Wishlist, Notification, OrderStatus, OrderStatusLog,
  Invoice, InvoiceItem, InvoiceStatus
} from './types';

// --- MOCK DATA ---

const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'Seoul Boutique', country: 'South Korea', currency: 'KRW', status: 'active' },
  { id: 'c2', name: 'Tokyo Fashion', country: 'Japan', currency: 'JPY', status: 'active' },
];

const MOCK_USERS_INIT: User[] = [
  { id: 'u1', email: 'admin@goyol.com', name: 'Admin User', role: 'admin', status: 'active' },
  { id: 'u2', email: 'buyer@goyol.com', name: 'Kim Buyer', role: 'buyer', companyId: 'c1', status: 'active' },
  { id: 'u3', email: 'buyer@tokyo.com', name: 'Tanaka Buyer', role: 'buyer', companyId: 'c2', status: 'active' },
];

const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p1', sku: 'CS-001', name: 'Classic Cashmere Scarf', category: 'Accessories', 
    description: 'Woven from the finest fibers, this classic scarf offers a timeless elegance. Its lightweight yet warm composition makes it perfect for transitional weather.', 
    moq: 10, isActive: true,
    imageUrl: 'https://picsum.photos/400/500?random=1',
    images: [
      'https://picsum.photos/400/500?random=1',
      'https://picsum.photos/400/500?random=101',
      'https://picsum.photos/400/500?random=102'
    ],
    material: '100% Grade A Mongolian Cashmere',
    dimensions: '30cm x 180cm'
  },
  { 
    id: 'p2', sku: 'CS-002', name: 'V-Neck Pullover', category: 'Apparel', 
    description: 'A relaxed fit pullover featuring a classic V-neck. Designed for layering, this piece combines comfort with sophisticated style.', 
    moq: 5, isActive: true,
    imageUrl: 'https://picsum.photos/400/500?random=2',
    images: [
      'https://picsum.photos/400/500?random=2',
      'https://picsum.photos/400/500?random=201',
    ],
    material: '100% 2-ply Cashmere',
    dimensions: 'XS, S, M, L, XL'
  },
  { 
    id: 'p3', sku: 'CS-003', name: 'Cable Knit Cardigan', category: 'Apparel', 
    description: 'Chunky 4-ply knit with organic horn buttons. This cardigan is a statement piece that provides superior warmth.', 
    moq: 5, isActive: true,
    imageUrl: 'https://picsum.photos/400/500?random=3',
    images: [
      'https://picsum.photos/400/500?random=3'
    ],
    material: '100% 4-ply Cashmere',
    dimensions: 'S, M, L'
  },
];

const MOCK_VISIBILITY: CompanyProductVisibility[] = [
  { companyId: 'c1', productId: 'p1', isVisible: true },
  { companyId: 'c1', productId: 'p2', isVisible: true },
  { companyId: 'c1', productId: 'p3', isVisible: true },
  { companyId: 'c2', productId: 'p1', isVisible: true },
  { companyId: 'c2', productId: 'p2', isVisible: false }, // Tokyo can't see p2
  { companyId: 'c2', productId: 'p3', isVisible: true },
];

const MOCK_PRICES: ProductPrice[] = [
  // Seoul Prices (KRW)
  { id: 'pr1', companyId: 'c1', productId: 'p1', unitPrice: 150000, currency: 'KRW', effectiveFrom: '2023-01-01' },
  { id: 'pr2', companyId: 'c1', productId: 'p2', unitPrice: 320000, currency: 'KRW', effectiveFrom: '2023-01-01' },
  { id: 'pr3', companyId: 'c1', productId: 'p3', unitPrice: 450000, currency: 'KRW', effectiveFrom: '2023-01-01' },
  // Tokyo Prices (JPY)
  { id: 'pr4', companyId: 'c2', productId: 'p1', unitPrice: 15000, currency: 'JPY', effectiveFrom: '2023-01-01' },
  { id: 'pr5', companyId: 'c2', productId: 'p3', unitPrice: 48000, currency: 'JPY', effectiveFrom: '2023-01-01' },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'o1', orderNumber: 'ORD-2023-001', companyId: 'c1', userId: 'u2', status: 'approved',
    expectedShipDate: '2023-11-20', currency: 'KRW', totalAmount: 1500000, createdAt: '2023-11-01T10:00:00Z',
    items: [
      { id: 'oi1', productId: 'p1', sku: 'CS-001', productName: 'Classic Cashmere Scarf', quantity: 10, unitPrice: 150000, totalPrice: 1500000 }
    ],
    history: []
  }
];

// --- STORE CONTEXT ---

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  categories: string[];
  companies: Company[];
  orders: Order[];
  invoices: Invoice[];
  notifications: Notification[];
  wishlist: Wishlist[];
  cart: { productId: string, quantity: number }[];
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  
  // Data Access Helpers
  getProductPrice: (companyId: string, productId: string) => ProductPrice | null;
  isProductVisible: (companyId: string, productId: string) => boolean;
  
  // Mutations
  toggleWishlist: (productId: string) => void;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;

  createOrder: (items: { productId: string, quantity: number }[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, expectedShipDate?: string) => void;
  createInvoice: (orderId: string) => void;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
  setCompanyProductVisibility: (companyId: string, productId: string, isVisible: boolean) => void;
  addProductPrice: (price: ProductPrice) => void;
  markNotificationRead: (id: string) => void;
  
  // Product CRUD
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Category CRUD
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;

  // Company CRUD
  addCompany: (company: Company) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (companyId: string) => void;

  // User CRUD
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Mutable State
  const [users, setUsers] = useState<User[]>(MOCK_USERS_INIT);
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(['Accessories', 'Apparel']);
  const [prices, setPrices] = useState(MOCK_PRICES);
  const [visibility, setVisibility] = useState(MOCK_VISIBILITY);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cart, setCart] = useState<{ productId: string, quantity: number }[]>([]);

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) setCurrentUser(user);
    else alert('User not found. Try admin@goyol.com or buyer@goyol.com');
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const getProductPrice = (companyId: string, productId: string) => {
    const today = new Date().toISOString().split('T')[0];
    // Find active price: effectiveFrom <= today AND (effectiveTo is null OR effectiveTo >= today)
    const validPrices = prices.filter(p => 
      p.companyId === companyId && 
      p.productId === productId &&
      p.effectiveFrom <= today &&
      (!p.effectiveTo || p.effectiveTo >= today)
    );
    // Sort by effectiveFrom descending to get latest
    validPrices.sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
    return validPrices[0] || null;
  };

  const isProductVisible = (companyId: string, productId: string) => {
    const rule = visibility.find(v => v.companyId === companyId && v.productId === productId);
    return rule ? rule.isVisible : false; // Default false if not mapped
  };

  const toggleWishlist = (productId: string) => {
    if (!currentUser) return;
    const exists = wishlist.some(w => w.userId === currentUser.id && w.productId === productId);
    if (exists) {
      setWishlist(prev => prev.filter(w => !(w.userId === currentUser.id && w.productId === productId)));
    } else {
      setWishlist(prev => [...prev, { userId: currentUser.id, productId }]);
    }
  };

  // Cart Actions
  const addToCart = (productId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        return prev.map(p => p.productId === productId ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { productId, quantity }];
    });
    alert("Item added to cart.");
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.productId !== productId));
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(p => p.productId === productId ? { ...p, quantity } : p));
  };

  const clearCart = () => setCart([]);

  const createOrder = (itemsPayload: { productId: string, quantity: number }[]) => {
    if (!currentUser || !currentUser.companyId) return;
    
    const company = companies.find(c => c.id === currentUser.companyId);
    if (!company) return;

    let orderTotal = 0;
    const orderItems: OrderItem[] = [];

    itemsPayload.forEach((item, idx) => {
      const product = products.find(p => p.id === item.productId);
      const price = getProductPrice(currentUser.companyId!, item.productId);
      
      if (product && price) {
        const itemTotal = price.unitPrice * item.quantity;
        orderTotal += itemTotal;
        orderItems.push({
          id: `oi-${Date.now()}-${idx}`,
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: price.unitPrice,
          totalPrice: itemTotal
        });
      }
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      companyId: currentUser.companyId,
      userId: currentUser.id,
      status: 'pending',
      currency: company.currency,
      totalAmount: orderTotal,
      createdAt: new Date().toISOString(),
      items: orderItems,
      history: [{
        id: `hist-${Date.now()}`,
        orderId: `ord-${Date.now()}`,
        newStatus: 'pending',
        changedBy: currentUser.id,
        changedAt: new Date().toISOString()
      }]
    };

    setOrders(prev => [newOrder, ...prev]);
    alert('Order placed successfully!');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, expectedShipDate?: string) => {
    if (!currentUser) return;
    
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      
      const historyEntry: OrderStatusLog = {
        id: `hist-${Date.now()}`,
        orderId: o.id,
        oldStatus: o.status,
        newStatus: status,
        changedBy: currentUser.id,
        changedAt: new Date().toISOString()
      };

      // Notify Buyer
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: o.userId,
        type: `order_${status}`,
        message: `Order #${o.orderNumber} is now ${status}.${expectedShipDate ? ` Expected Ship: ${expectedShipDate}` : ''}`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);

      return {
        ...o,
        status,
        expectedShipDate: expectedShipDate || o.expectedShipDate,
        history: [...o.history, historyEntry]
      };
    }));
  };

  const createInvoice = (orderId: string) => {
    // 1. Check if order exists
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // 2. Check for duplicate invoice (one per order)
    if (invoices.some(i => i.orderId === orderId)) {
      alert("Invoice already exists for this order.");
      return;
    }

    // 3. Create invoice items snapshot
    const invoiceItems: InvoiceItem[] = order.items.map(item => ({
      id: `inv-item-${Date.now()}-${Math.random()}`,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    }));

    // 4. Create Invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      companyId: order.companyId,
      orderId: order.id,
      currency: order.currency,
      totalAmount: order.totalAmount,
      issuedAt: new Date().toISOString(),
      status: 'issued',
      items: invoiceItems
    };

    setInvoices(prev => [newInvoice, ...prev]);
    
    // Notify Buyer
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: order.userId,
      type: 'invoice_issued',
      message: `Invoice #${newInvoice.invoiceNumber} has been issued for Order #${order.orderNumber}.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    alert("Invoice generated successfully!");
  };

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) return { ...inv, status };
      return inv;
    }));
    
    const inv = invoices.find(i => i.id === invoiceId);
    const order = orders.find(o => o.id === inv?.orderId);

    if (inv && order) {
      // Notify Buyer
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: order.userId,
        type: `invoice_${status}`,
        message: `Invoice #${inv.invoiceNumber} status changed to ${status}.`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const setCompanyProductVisibility = (companyId: string, productId: string, isVisible: boolean) => {
    setVisibility(prev => {
      const existing = prev.findIndex(v => v.companyId === companyId && v.productId === productId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], isVisible };
        return updated;
      } else {
        return [...prev, { companyId, productId, isVisible }];
      }
    });
  };

  const addProductPrice = (price: ProductPrice) => {
    setPrices(prev => [...prev, price]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
  };

  const updateCompany = (company: Company) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? company : c));
  };

  const deleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    // Cleanup users associated with this company
    setUsers(prev => prev.filter(u => u.companyId !== companyId));
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <StoreContext.Provider value={{
      currentUser, users, products, categories, companies, orders, invoices, notifications, wishlist, cart,
      login, logout, getProductPrice, isProductVisible,
      toggleWishlist, addToCart, removeFromCart, updateCartItem, clearCart, createOrder, updateOrderStatus, createInvoice, updateInvoiceStatus,
      setCompanyProductVisibility, addProductPrice, markNotificationRead,
      addProduct, updateProduct, deleteProduct,
      addCategory, deleteCategory,
      addCompany, updateCompany, deleteCompany,
      addUser, deleteUser
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};