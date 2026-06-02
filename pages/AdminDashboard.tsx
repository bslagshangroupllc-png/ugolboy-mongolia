import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Badge, formatCurrency, Button, Input } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Company, Order, User } from '../types';
import { FileText, Send, CheckSquare, Plus, Edit, Trash2, X, UserPlus, Eye, Calendar, Clock, Truck, Ban } from 'lucide-react';

export const AdminDashboard = () => {
  const { orders } = useStore();

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
  };

  const chartData = [
    { name: 'Pending', count: stats.pending },
    { name: 'Approved', count: stats.approved },
    { name: 'Shipped', count: stats.shipped },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
           <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
           <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
        </Card>
        <Card className="p-6">
           <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
           <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </Card>
        <Card className="p-6">
           <h3 className="text-sm font-medium text-gray-500">In Production</h3>
           <p className="text-3xl font-bold text-blue-600 mt-2">{stats.approved}</p>
        </Card>
        <Card className="p-6">
           <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
           <p className="text-3xl font-bold text-green-600 mt-2">{stats.shipped}</p>
        </Card>
      </div>

      <Card className="p-6 h-80">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#7d7055" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export const AdminOrderList = () => {
  const { orders, companies, invoices, updateOrderStatus, createInvoice } = useStore();
  const [filter, setFilter] = useState('all');
  
  // State for Modals
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [approveOrder, setApproveOrder] = useState<Order | null>(null);
  const [shipDate, setShipDate] = useState('');

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  // Handle opening the approval modal
  const initiateApproval = (order: Order) => {
    setApproveOrder(order);
    // Default to 14 days from now
    const defaultDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    setShipDate(defaultDate);
  };

  // Confirm approval
  const confirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (approveOrder && shipDate) {
      updateOrderStatus(approveOrder.id, 'approved', shipDate);
      setApproveOrder(null);
      setShipDate('');
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Order ID,Company,Total,Status\n"
      + filteredOrders.map(o => {
          const c = companies.find(comp => comp.id === o.companyId);
          return `${o.orderNumber},${c?.name},${o.totalAmount},${o.status}`;
      }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <Button variant="secondary" onClick={handleExport} className="w-full sm:w-auto">Export CSV</Button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'shipped'].map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-primary-700 text-white shadow-sm' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-md overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No orders found matching this filter.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map(order => {
               const company = companies.find(c => c.id === order.companyId);
               const hasInvoice = invoices.some(i => i.orderId === order.id);
               return (
                <li key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                         <span className="text-base font-semibold text-primary-700">{order.orderNumber}</span>
                         <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                           {company?.name}
                         </span>
                         <Badge color={order.status === 'pending' ? 'yellow' : order.status === 'approved' ? 'blue' : order.status === 'shipped' ? 'green' : 'red'}>
                            {order.status.toUpperCase()}
                         </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                         {order.items.length} items · <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount, order.currency)}</span>
                      </div>
                      {order.expectedShipDate && (
                        <p className="text-xs text-blue-600 mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> Ship: {order.expectedShipDate}
                        </p>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                       <Button size="sm" variant="secondary" onClick={() => setViewOrder(order)} title="View Details" className="flex items-center">
                          <Eye className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">View</span>
                       </Button>

                       {order.status === 'pending' && (
                         <Button size="sm" onClick={() => initiateApproval(order)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                           <CheckSquare className="h-4 w-4 mr-1" /> Approve
                         </Button>
                       )}
                       
                       {order.status !== 'pending' && !hasInvoice && (
                          <Button size="sm" variant="secondary" onClick={() => createInvoice(order.id)} className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" /> Invoice
                          </Button>
                       )}
                       
                       {order.status === 'approved' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped')} className="flex items-center bg-green-600 hover:bg-green-700 text-white">
                            <Truck className="h-4 w-4 mr-1" /> Ship
                          </Button>
                       )}

                       {order.status !== 'cancelled' && order.status !== 'shipped' && (
                          <Button size="sm" variant="ghost" onClick={() => { if(confirm('Cancel order?')) updateOrderStatus(order.id, 'cancelled'); }} title="Cancel">
                            <Ban className="h-4 w-4 text-red-400" />
                          </Button>
                       )}
                    </div>
                  </div>
                </li>
               );
            })}
          </ul>
        )}
      </div>

      {/* Approval Modal */}
      {approveOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm bg-white p-6 relative">
            <button onClick={() => setApproveOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <CheckSquare className="h-5 w-5 text-blue-600 mr-2" />
                Approve Order
              </h3>
              <p className="text-sm text-gray-500 mt-1">Order #{approveOrder.orderNumber}</p>
            </div>
            
            <form onSubmit={confirmApproval}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Expected Ship Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="date" 
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={shipDate}
                    onChange={(e) => setShipDate(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">This date will be visible to the customer.</p>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setApproveOrder(null)}>Cancel</Button>
                <Button type="submit">Confirm Approval</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* View Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white p-0 relative overflow-hidden flex flex-col max-h-[90vh] shadow-xl">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                  <span className="font-mono">{viewOrder.orderNumber}</span>
                  <span>•</span>
                  <span>{new Date(viewOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={() => setViewOrder(null)} className="text-gray-400 hover:text-gray-500 p-1">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Info</h4>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{companies.find(c => c.id === viewOrder.companyId)?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{companies.find(c => c.id === viewOrder.companyId)?.country}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Status</h4>
                  <div className="flex items-center space-x-2">
                    <Badge color={viewOrder.status === 'pending' ? 'yellow' : viewOrder.status === 'approved' ? 'blue' : viewOrder.status === 'shipped' ? 'green' : 'red'}>
                      {viewOrder.status.toUpperCase()}
                    </Badge>
                  </div>
                  {viewOrder.expectedShipDate && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                       <Clock className="h-4 w-4 mr-1 text-gray-400" /> 
                       Est. Ship: <span className="font-medium ml-1">{viewOrder.expectedShipDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewOrder.items.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">{item.sku}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 text-right whitespace-nowrap">{formatCurrency(item.unitPrice, viewOrder.currency)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium whitespace-nowrap">{formatCurrency(item.totalPrice, viewOrder.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">Grand Total</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right whitespace-nowrap">{formatCurrency(viewOrder.totalAmount, viewOrder.currency)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
               <Button variant="secondary" onClick={() => setViewOrder(null)} className="w-full sm:w-auto">Close</Button>
               {viewOrder.status === 'pending' && (
                 <Button onClick={() => { setViewOrder(null); initiateApproval(viewOrder); }} className="w-full sm:w-auto">Approve Order</Button>
               )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export const AdminInvoiceList = () => {
  const { invoices, companies, updateInvoiceStatus } = useStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {invoices.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No invoices generated yet. Go to Orders to generate invoices.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {invoices.map(inv => {
              const company = companies.find(c => c.id === inv.companyId);
              return (
                <li key={inv.id} className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{inv.invoiceNumber}</p>
                        <span className="ml-2 text-sm text-gray-500">for {company?.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{formatCurrency(inv.totalAmount, inv.currency)} · Issued: {new Date(inv.issuedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge color={inv.status === 'paid' ? 'green' : inv.status === 'sent' ? 'blue' : 'gray'}>
                        {inv.status.toUpperCase()}
                      </Badge>
                      
                      {inv.status === 'issued' && (
                        <Button size="sm" variant="secondary" onClick={() => updateInvoiceStatus(inv.id, 'sent')}>
                          <Send className="h-4 w-4 mr-1" /> Mark Sent
                        </Button>
                      )}
                      {inv.status === 'sent' && (
                        <Button size="sm" variant="secondary" onClick={() => updateInvoiceStatus(inv.id, 'paid')}>
                          <CheckSquare className="h-4 w-4 mr-1" /> Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export const CompanyManagement = () => {
  const { 
    companies, users, products, 
    addCompany, updateCompany, deleteCompany,
    addUser,
    isProductVisible, setCompanyProductVisibility, 
    getProductPrice, addProductPrice 
  } = useStore();
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    country: '',
    currency: 'USD',
    // New User Fields
    buyerName: '',
    buyerEmail: ''
  });

  const [priceForm, setPriceForm] = useState({ productId: '', price: '' });

  const resetForm = () => {
    setFormData({
      id: '', name: '', country: '', currency: 'USD',
      buyerName: '', buyerEmail: ''
    });
    setIsEditing(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (company: Company) => {
    setFormData({
      id: company.id,
      name: company.name,
      country: company.country,
      currency: company.currency,
      buyerName: '', // Not editing user in this modal, only company details
      buyerEmail: ''
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure? This will delete the company and its users.")) {
      deleteCompany(id);
      if (selectedCompany?.id === id) setSelectedCompany(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateCompany({
        id: formData.id,
        name: formData.name,
        country: formData.country,
        currency: formData.currency,
        status: 'active'
      });
    } else {
      const newCompanyId = `c-${Date.now()}`;
      // 1. Create Company
      addCompany({
        id: newCompanyId,
        name: formData.name,
        country: formData.country,
        currency: formData.currency,
        status: 'active'
      });
      // 2. Create Initial User
      if (formData.buyerEmail) {
        addUser({
          id: `u-${Date.now()}`,
          name: formData.buyerName || 'Buyer',
          email: formData.buyerEmail,
          role: 'buyer',
          status: 'active',
          companyId: newCompanyId
        });
      }
    }
    setShowModal(false);
  };

  const handleSetPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !priceForm.productId) return;
    
    addProductPrice({
      id: `pr-${Date.now()}`,
      companyId: selectedCompany.id,
      productId: priceForm.productId,
      unitPrice: parseFloat(priceForm.price),
      currency: selectedCompany.currency,
      effectiveFrom: new Date().toISOString().split('T')[0]
    });
    setPriceForm({ productId: '', price: '' });
  };

  const companyUsers = selectedCompany ? users.filter(u => u.companyId === selectedCompany.id) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Companies</h2>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <div className="bg-white shadow rounded-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {companies.map(c => (
              <li 
                key={c.id} 
                className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 ${selectedCompany?.id === c.id ? 'bg-primary-50' : ''}`}
                onClick={() => setSelectedCompany(c)}
              >
                <div>
                  <p className="font-medium text-gray-900">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.country} · {c.currency}</p>
                </div>
                <div className="flex space-x-1">
                   <button onClick={(e) => { e.stopPropagation(); handleEdit(c); }} className="p-1 text-gray-400 hover:text-gray-600">
                     <Edit className="h-4 w-4" />
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="p-1 text-red-400 hover:text-red-600">
                     <Trash2 className="h-4 w-4" />
                   </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-2">
        {selectedCompany ? (
          <div className="space-y-6">
             {/* Company Info Header */}
             <Card className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
                    <p className="text-gray-500">{selectedCompany.country} · Currency: {selectedCompany.currency}</p>
                  </div>
                  <Badge color={selectedCompany.status === 'active' ? 'green' : 'gray'}>{selectedCompany.status}</Badge>
                </div>
                
                {/* Users Section */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                   <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                     <UserPlus className="h-4 w-4 mr-2" /> Assigned Users (Buyers)
                   </h3>
                   {companyUsers.length === 0 ? (
                     <p className="text-sm text-gray-400 italic">No users assigned. Edit company to add?</p>
                   ) : (
                     <ul className="space-y-2">
                       {companyUsers.map(u => (
                         <li key={u.id} className="text-sm flex justify-between bg-gray-50 p-2 rounded">
                           <span>{u.name} <span className="text-gray-500">({u.email})</span></span>
                           <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{u.status}</span>
                         </li>
                       ))}
                     </ul>
                   )}
                </div>
             </Card>

            {/* Visibility Table */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Product Visibility & Pricing</h3>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50">Product</th>
                       <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50">Visible</th>
                       <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50">Current Price</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map(p => {
                      const visible = isProductVisible(selectedCompany.id, p.id);
                      const price = getProductPrice(selectedCompany.id, p.id);
                      return (
                        <tr key={p.id}>
                          <td className="px-3 py-2 text-sm text-gray-900">{p.name}</td>
                          <td className="px-3 py-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={visible} 
                              onChange={(e) => setCompanyProductVisibility(selectedCompany.id, p.id, e.target.checked)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 text-right font-mono">
                            {price ? formatCurrency(price.unitPrice, price.currency) : <span className="text-gray-300">-</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add Price Form */}
              <div className="bg-gray-50 p-4 rounded-md mt-4 border border-gray-200">
                <h3 className="text-sm font-medium mb-2">Update Price</h3>
                <form onSubmit={handleSetPrice} className="flex gap-4 items-end">
                  <div className="flex-1">
                     <label className="block text-xs text-gray-500">Product</label>
                     <select 
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      value={priceForm.productId}
                      onChange={e => setPriceForm({...priceForm, productId: e.target.value})}
                     >
                       <option value="">Select Product</option>
                       {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500">Price ({selectedCompany.currency})</label>
                    <input 
                      type="number" 
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={priceForm.price}
                      onChange={e => setPriceForm({...priceForm, price: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={!priceForm.productId || !priceForm.price}>Save</Button>
                </form>
              </div>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300 p-12">
            Select a company to manage or create a new one.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Company' : 'New Company'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Company Name" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Country" value={formData.country} onChange={(e: any) => setFormData({...formData, country: e.target.value})} />
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                   <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                   >
                     <option value="USD">USD</option>
                     <option value="EUR">EUR</option>
                     <option value="KRW">KRW</option>
                     <option value="JPY">JPY</option>
                   </select>
                </div>
              </div>

              {!isEditing && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-4">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">Create First User (Login)</h3>
                  <p className="text-xs text-blue-700 mb-3">Create the initial buyer account for this company. You can share this email with the client for login.</p>
                  <div className="space-y-3">
                    <Input label="Buyer Name" value={formData.buyerName} onChange={(e: any) => setFormData({...formData, buyerName: e.target.value})} required={!isEditing} placeholder="e.g. John Doe" />
                    <Input label="Login Email" type="email" value={formData.buyerEmail} onChange={(e: any) => setFormData({...formData, buyerEmail: e.target.value})} required={!isEditing} placeholder="e.g. buyer@company.com" />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Save Company</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};