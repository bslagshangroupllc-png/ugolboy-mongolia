import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Input, Button, Card } from '../components/ui';

export const Login = () => {
  const [email, setEmail] = useState('');
  const { login, currentUser } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin');
      else navigate('/products');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8 space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
            Partner Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure login for registered buyers and administrators
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input 
              type="email" 
              label="Email Address" 
              required 
              value={email} 
              onChange={(e: any) => setEmail(e.target.value)} 
              placeholder="e.g. buyer@goyol.com"
            />
          </div>
          <Button type="submit" className="w-full flex justify-center">
            Sign In
          </Button>
          <div className="text-xs text-center text-gray-400 mt-4">
             Demo: <span className="font-mono">admin@goyol.com</span> or <span className="font-mono">buyer@goyol.com</span>
          </div>
        </form>
      </Card>
    </div>
  );
};