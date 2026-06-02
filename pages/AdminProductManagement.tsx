import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { Product } from '../types';
import { Button, Input, Card, Badge } from '../components/ui';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Upload, Settings } from 'lucide-react';

export const AdminProductManagement = () => {
  const { 
    products, categories, companies, 
    addProduct, updateProduct, deleteProduct, 
    addCategory, deleteCategory,
    isProductVisible, setCompanyProductVisibility
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [showModal, setShowModal] = useState(false);
  
  // Visibility State for the Modal
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>({});

  // Category Management State
  const [showCategoryMgr, setShowCategoryMgr] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNew = () => {
    setCurrentProduct({
      id: `p-${Date.now()}`,
      isActive: true,
      sku: '',
      name: '',
      category: categories[0] || '',
      description: '',
      moq: 1,
      imageUrl: ''
    });
    
    // Reset visibility map
    const initialVisibility: Record<string, boolean> = {};
    companies.forEach(c => initialVisibility[c.id] = false);
    setVisibilityMap(initialVisibility);

    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct({ ...product });
    
    // Load existing visibility
    const currentVisibility: Record<string, boolean> = {};
    companies.forEach(c => {
      currentVisibility[c.id] = isProductVisible(c.id, product.id);
    });
    setVisibilityMap(currentVisibility);

    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productId = currentProduct.id!;
    
    // Save Product
    if (isEditing) {
      updateProduct(currentProduct as Product);
    } else {
      addProduct(currentProduct as Product);
    }

    // Save Visibility settings
    Object.keys(visibilityMap).forEach(companyId => {
      setCompanyProductVisibility(companyId, productId, visibilityMap[companyId]);
    });

    setShowModal(false);
  };

  const toggleVisibility = (companyId: string) => {
    setVisibilityMap(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map(product => (
            <li key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center overflow-hidden border border-gray-200">
                  {product.imageUrl ? (
                    <img className="h-16 w-16 object-cover" src={product.imageUrl} alt="" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">SKU: {product.sku} | Cat: {product.category}</div>
                  <div className="text-xs text-gray-400">MOQ: {product.moq}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge color={product.isActive ? 'green' : 'gray'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
                <Button variant="secondary" onClick={() => handleEdit(product)} className="p-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)} className="p-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
           <Card className="w-full max-w-3xl bg-white p-6 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Product' : 'New Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info & Image */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image Upload Area */}
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div 
                      className="w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      {currentProduct.imageUrl ? (
                        <img src={currentProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4 text-gray-500">
                           <Upload className="h-8 w-8 mx-auto mb-2" />
                           <span className="text-xs">Click to upload image</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Button type="button" variant="secondary" size="sm" className="mt-2 w-full" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                       Select Image
                    </Button>
                  </div>

                  {/* Fields */}
                  <div className="w-full md:w-2/3 space-y-4">
                    <Input label="Product Name" value={currentProduct.name} onChange={(e:any) => setCurrentProduct({...currentProduct, name: e.target.value})} required />
                    
                    <div className="grid grid-cols-2 gap-4">
                       <Input label="SKU" value={currentProduct.sku} onChange={(e:any) => setCurrentProduct({...currentProduct, sku: e.target.value})} required />
                       <Input type="number" label="MOQ" value={currentProduct.moq} onChange={(e:any) => setCurrentProduct({...currentProduct, moq: parseInt(e.target.value)})} required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <div className="flex gap-2">
                        <select 
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                          value={currentProduct.category}
                          onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Button type="button" variant="secondary" onClick={() => setShowCategoryMgr(!showCategoryMgr)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Inline Category Manager */}
                      {showCategoryMgr && (
                        <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 mb-2">Manage Categories</h4>
                          <div className="flex gap-2 mb-2">
                            <input 
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded" 
                              placeholder="New Category"
                              value={newCategoryName}
                              onChange={e => setNewCategoryName(e.target.value)}
                            />
                            <Button type="button" size="sm" onClick={handleAddCategory}>Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {categories.map(c => (
                              <span key={c} className="inline-flex items-center px-2 py-1 rounded bg-white border border-gray-200 text-xs">
                                {c}
                                <button type="button" onClick={() => deleteCategory(c)} className="ml-1 text-red-500 hover:text-red-700">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" 
                    rows={4}
                    value={currentProduct.description}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                   <input 
                     type="checkbox" 
                     id="isActive"
                     checked={currentProduct.isActive} 
                     onChange={(e) => setCurrentProduct({...currentProduct, isActive: e.target.checked})}
                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                   />
                   <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Product is Active (Publicly Visible)</label>
                </div>

                {/* Company Visibility Matrix */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Company Visibility</h3>
                  <p className="text-xs text-gray-500 mb-2">Select which companies are allowed to view and order this product.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded border border-gray-200">
                    {companies.map(company => (
                      <label key={company.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                        <input 
                          type="checkbox"
                          checked={!!visibilityMap[company.id]}
                          onChange={() => toggleVisibility(company.id)}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{company.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit">Save Product</Button>
                </div>
              </form>
           </Card>
        </div>
      )}
    </div>
  );
};