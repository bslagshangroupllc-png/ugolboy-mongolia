import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, Button, Badge, formatCurrency, Input } from '../components/ui';
import { Heart, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductList = () => {
  const { products, currentUser, isProductVisible, getProductPrice } = useStore();
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  // Filter products based on visibility
  const visibleProducts = products.filter(p => {
    if (!currentUser) return p.isActive; // Public sees all active
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'buyer' && currentUser.companyId) {
      return isProductVisible(currentUser.companyId, p.id);
    }
    return false;
  });

  const filteredProducts = category === 'All' 
    ? visibleProducts 
    : visibleProducts.filter(p => p.category === category);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Current Collection</h1>
          <p className="mt-2 text-gray-500">Premium Mongolian Cashmere</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${category === c ? 'bg-primary-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => {
          let price = null;
          if (currentUser?.role === 'buyer' && currentUser.companyId) {
            price = getProductPrice(currentUser.companyId, product.id);
          }

          return (
            <div key={product.id} className="group relative cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:h-80 lg:aspect-none">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full group-hover:opacity-75 transition-opacity" />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                </div>
                {price && (
                  <p className="text-lg font-medium text-primary-700">{formatCurrency(price.unitPrice, price.currency)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, currentUser, getProductPrice, toggleWishlist, wishlist, addToCart } = useStore();
  const [quantity, setQuantity] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find(p => p.id === id);
  if (!product) return <div>Product not found</div>;

  let price = null;
  const isBuyer = currentUser?.role === 'buyer' && currentUser.companyId;
  if (isBuyer) {
    price = getProductPrice(currentUser.companyId!, product.id);
  }

  const isLiked = wishlist.some(w => w.productId === product.id && w.userId === currentUser?.id);

  const productImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    if (quantity < product.moq) {
      alert(`Minimum Order Quantity is ${product.moq}`);
      return;
    }
    addToCart(product.id, quantity);
  };

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Collection
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Image Carousel */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-w-4 aspect-h-5 bg-gray-100 rounded-lg overflow-hidden group">
             <img 
               src={productImages[activeImageIndex]} 
               alt={`${product.name} view ${activeImageIndex + 1}`} 
               className="w-full h-full object-center object-cover" 
             />
             
             {productImages.length > 1 && (
               <>
                 <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-gray-800 hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-gray-800 hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
               </>
             )}
          </div>
          
          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === idx ? 'border-primary-600 ring-1 ring-primary-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-center object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-4 flex items-baseline">
            {price ? (
              <p className="text-3xl font-medium text-primary-700">{formatCurrency(price.unitPrice, price.currency)}</p>
            ) : (
               <p className="text-xl text-gray-500 italic">Log in to view wholesale pricing</p>
            )}
            <span className="ml-4 text-sm text-gray-500 uppercase tracking-wide">{product.category}</span>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

          {/* Specifications Section */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
              <dl className="divide-y divide-gray-200">
                <div className="grid grid-cols-3 gap-4 px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Reference SKU</dt>
                  <dd className="text-sm text-gray-900 col-span-2 font-mono">{product.sku}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Material Composition</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{product.material || 'N/A'}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Dimensions / Sizing</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{product.dimensions || 'Standard'}</dd>
                </div>
                <div className="grid grid-cols-3 gap-4 px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Minimum Order (MOQ)</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{product.moq} Units</dd>
                </div>
              </dl>
            </div>
          </div>

          {isBuyer && price && (
            <div className="mt-10 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Place Wholesale Order</h3>
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full sm:w-32">
                   <Input 
                      type="number" 
                      label="Quantity" 
                      min={product.moq}
                      value={quantity} 
                      onChange={(e: any) => setQuantity(parseInt(e.target.value))} 
                    />
                </div>
                <div className="flex-1 w-full mb-4">
                  <Button onClick={handleAddToCart} className="w-full h-[42px]" disabled={quantity < product.moq}>
                    Add to Cart
                  </Button>
                </div>
                 <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`mb-4 p-2.5 rounded-md border transition-colors ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-300 text-gray-400 hover:text-gray-500'}`}
                  title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
              {quantity > 0 && quantity < product.moq && (
                 <p className="text-sm text-red-600 mt-2 flex items-center">
                   <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2" />
                   Minimum order quantity is {product.moq} units
                 </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};