export type Role = 'public' | 'buyer' | 'admin';

export type UserStatus = 'pending' | 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyId?: string; // Null for admin
  status: UserStatus;
}

export interface Company {
  id: string;
  name: string;
  country: string;
  currency: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  moq: number;
  isActive: boolean;
  imageUrl: string;
  images?: string[]; // Array of image URLs
  material?: string;
  dimensions?: string;
}

export interface ProductPrice {
  id: string;
  companyId: string;
  productId: string;
  unitPrice: number;
  currency: string;
  effectiveFrom: string; // ISO Date
  effectiveTo?: string; // ISO Date | null
}

export interface CompanyProductVisibility {
  companyId: string;
  productId: string;
  isVisible: boolean;
}

export type OrderStatus = 'pending' | 'approved' | 'in_production' | 'shipped' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  sku: string; // Snapshot
  productName: string; // Snapshot
  quantity: number;
  unitPrice: number; // Snapshot
  totalPrice: number;
}

export interface OrderStatusLog {
  id: string;
  orderId: string;
  oldStatus?: OrderStatus;
  newStatus: OrderStatus;
  changedBy: string; // User ID
  changedAt: string; // ISO Date
}

export interface Order {
  id: string;
  orderNumber: string;
  companyId: string;
  userId: string; // Buyer ID
  status: OrderStatus;
  expectedShipDate?: string;
  currency: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  history: OrderStatusLog[];
}

export interface Wishlist {
  userId: string;
  productId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export type InvoiceStatus = 'issued' | 'sent' | 'paid';

export interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  orderId: string;
  currency: string;
  totalAmount: number;
  issuedAt: string; // ISO Date
  status: InvoiceStatus;
  items: InvoiceItem[];
}