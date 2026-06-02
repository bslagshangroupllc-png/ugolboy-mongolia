import React from 'react';
import { useStore } from '../store';
import { Card, Badge, formatCurrency, Button, Input } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

export const MyOrders = () => {
  const { orders, currentUser } = useStore();
  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'shipped': return 'blue';
      case 'cancelled': return 'red';
      case 'in_production': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">My Orders</h1>
      {myOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col items-end">
                   <Badge color={getStatusColor(order.status)}>{order.status.toUpperCase().replace('_', ' ')}</Badge>
                   <p className="mt-1 text-lg font-bold">{formatCurrency(order.totalAmount, order.currency)}</p>
                </div>
              </div>
              
              <div className="mb-4">
                 {order.expectedShipDate && (
                   <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm mb-4 inline-block">
                     Expected Ship Date: <strong>{order.expectedShipDate}</strong>
                   </div>
                 )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 text-sm text-gray-900">{item.productName}</td>
                        <td className="px-3 py-2 text-sm text-gray-500">{item.sku}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice, order.currency)}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.totalPrice, order.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export const WishlistPage = () => {
  const { wishlist, products, toggleWishlist, currentUser, getProductPrice } = useStore();
  const navigate = useNavigate();

  const myWishlist = products.filter(p => wishlist.some(w => w.productId === p.id && w.userId === currentUser?.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">My Wishlist</h1>
       {myWishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {myWishlist.map(product => {
             const price = currentUser?.companyId ? getProductPrice(currentUser.companyId, product.id) : null;
             return (
               <Card key={product.id} className="relative group">
                 <div className="aspect-w-1 aspect-h-1 bg-gray-200 w-full overflow-hidden rounded-t-lg h-48 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                   <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-center" />
                 </div>
                 <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                    {price && <p className="text-sm text-gray-500 mt-1">{formatCurrency(price.unitPrice, price.currency)}</p>}
                    <div className="mt-4 flex space-x-2">
                      <Button onClick={() => navigate(`/products/${product.id}`)} className="flex-1 text-xs py-1">View</Button>
                      <Button variant="secondary" onClick={() => toggleWishlist(product.id)} className="px-2 py-1"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                 </div>
               </Card>
             );
          })}
        </div>
      )}
    </div>
  );
};

export const NotificationsPage = () => {
  const { notifications, currentUser, markNotificationRead } = useStore();
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
       <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Notifications</h1>
       <div className="space-y-4">
         {myNotifs.length === 0 && <p className="text-gray-500">No notifications.</p>}
         {myNotifs.map(n => (
           <div 
            key={n.id} 
            className={`p-4 rounded-lg border ${n.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'} transition-colors cursor-pointer`}
            onClick={() => markNotificationRead(n.id)}
          >
             <div className="flex justify-between items-start">
               <p className={`text-sm ${n.isRead ? 'text-gray-600' : 'text-blue-900 font-medium'}`}>{n.message}</p>
               <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
             </div>
             {!n.isRead && <span className="text-xs text-blue-600 mt-2 block font-medium">Click to mark as read</span>}
           </div>
         ))}
       </div>
    </div>
  );
};

export const CartPage = () => {
  const { cart, products, currentUser, getProductPrice, updateCartItem, removeFromCart, createOrder, clearCart } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
           <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Browse our collection and add items to your cart.</p>
        <Button onClick={() => navigate('/products')}>View Collection</Button>
      </div>
    );
  }

  // Calculate totals
  let totalAmount = 0;
  let currency = 'USD'; // Default fallback

  const cartItemsDetailed = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    const price = currentUser?.companyId ? getProductPrice(currentUser.companyId, item.productId) : null;
    
    if (price) {
      totalAmount += price.unitPrice * item.quantity;
      currency = price.currency;
    }

    return { ...item, product, price };
  });

  const handleCheckout = () => {
    createOrder(cart);
    clearCart();
    navigate('/my/orders');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <section className="lg:col-span-8">
          <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
            {cartItemsDetailed.map(({ productId, quantity, product, price }) => {
              if (!product) return null;
              return (
                <li key={productId} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <span className="font-medium text-gray-700 hover:text-gray-800 cursor-pointer" onClick={() => navigate(`/products/${productId}`)}>
                              {product.name}
                            </span>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{product.category}</p>
                        </div>
                        {price ? (
                          <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(price.unitPrice, price.currency)}</p>
                        ) : (
                           <p className="mt-1 text-sm text-red-500">Price unavailable</p>
                        )}
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${productId}`} className="sr-only">
                          Quantity
                        </label>
                        <div className="w-32">
                           <Input 
                             type="number" 
                             min={product.moq} 
                             value={quantity} 
                             onChange={(e: any) => updateCartItem(productId, parseInt(e.target.value))}
                           />
                           <p className="text-xs text-gray-500 mt-1">MOQ: {product.moq}</p>
                        </div>

                        <div className="absolute top-0 right-0">
                          <button 
                            type="button" 
                            onClick={() => removeFromCart(productId)}
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Order Summary */}
        <section className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">{formatCurrency(totalAmount, currency)}</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">Order Total</dt>
              <dd className="text-base font-medium text-gray-900">{formatCurrency(totalAmount, currency)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Button onClick={handleCheckout} className="w-full">
              Submit Order
            </Button>
            <p className="mt-4 text-xs text-gray-500 text-center">
              Orders are subject to approval. Expected shipping dates will be confirmed upon review.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};