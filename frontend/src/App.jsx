import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PlusCircle, MinusCircle, ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const App = () => {
  const [productList, setProductList] = useState([]);
  const [userCart, setUserCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product data from the FakeStore API
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProductList(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      }
    };
    fetchStoreData();
  }, []);


  const soukaryaCartManager = (product, actionType) => {
    setUserCart((currentCart) => {
      const itemExists = currentCart.find((item) => item.id === product.id);

      if (actionType === 'ADD') {
        if (itemExists) {
          return currentCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...currentCart, { ...product, quantity: 1 }];
      }

      if (actionType === 'REMOVE') {
        if (!itemExists) return currentCart;
        if (itemExists.quantity > 1) {
          return currentCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
          );
        }
        return currentCart.filter((item) => item.id !== product.id);
      }

      return currentCart;
    });
  };

  // Calculate total items for the navbar badge
  const totalItemsInCart = userCart.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center font-bold text-indigo-600 animate-pulse">
      Loading Store...
    </div>
  );

  return (
    <Router>
      <div className="bg-slate-50 min-h-screen font-sans">
        {/* Nav Bar */}
        <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
            SOUKARYA COMMERCE
          </Link>
          <Link to="/cart" className="relative p-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-all">
            <ShoppingBag className="text-indigo-600" size={24} />
            {totalItemsInCart > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {totalItemsInCart}
              </span>
            )}
          </Link>
        </nav>

        <Routes>
          <Route 
            path="/" 
            element={<StoreFront productList={productList} userCart={userCart} soukaryaCartManager={soukaryaCartManager} />} 
          />
          <Route 
            path="/cart" 
            element={<CartPage userCart={userCart} soukaryaCartManager={soukaryaCartManager} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

// firstlook at entry point 
const StoreFront = ({ productList, userCart, soukaryaCartManager }) => (
  <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {productList.map((product) => {
      const cartItem = userCart.find((item) => item.id === product.id);
      const quantity = cartItem ? cartItem.quantity : 0;

      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }} 
          key={product.id} 
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <div className="h-40 w-full flex items-center justify-center mb-4">
              <img src={product.image} alt={product.title} className="max-h-full object-contain" />
            </div>
            <h3 className="font-bold text-slate-800 line-clamp-1">{product.title}</h3>
            <p className="text-slate-500 text-xs mt-2 line-clamp-2">{product.description}</p>
          </div>

          <div className="mt-6">
            <p className="text-xl font-black text-slate-900 mb-4">${product.price}</p>
            
            {/* appling the conut logics */}
            <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl">
              <button 
                onClick={() => soukaryaCartManager(product, 'REMOVE')}
                disabled={quantity === 0}
                className={`p-2 rounded-lg transition-all ${quantity > 0 ? 'bg-white text-red-500 shadow-sm' : 'text-slate-300'}`}
              >
                <MinusCircle size={20} />
              </button>

              <span className={`font-bold text-lg ${quantity > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                {quantity}
              </span>

              <button 
                onClick={() => soukaryaCartManager(product, 'ADD')}
                className="p-2 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <PlusCircle size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      );
    })}
  </main>
);

// Cart Page ..
const CartPage = ({ userCart, soukaryaCartManager }) => {
  const totalPrice = userCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors">
        <ArrowLeft size={18} /> Continue Shopping
      </Link>
      
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="text-slate-800" size={32} />
        <h2 className="text-3xl font-black text-slate-800">Checkout</h2>
      </div>
      
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100">
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {userCart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-slate-400 font-medium">Your cart is empty. Go grab some deals!</p>
              </motion.div>
            ) : (
              userCart.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-50 pb-6 last:border-0"
                >
                  <img src={item.image} className="w-24 h-24 object-contain" alt="" />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-slate-800 text-lg">{item.title}</p>
                    <p className="text-indigo-600 font-black mt-1">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <button onClick={() => soukaryaCartManager(item, 'REMOVE')} className="text-slate-400 hover:text-red-500 transition-colors">
                        {item.quantity === 1 ? <Trash2 size={20} /> : <MinusCircle size={20} />}
                      </button>
                      <span className="font-black text-xl text-slate-700 min-w-5 text-center">{item.quantity}</span>
                      <button onClick={() => soukaryaCartManager(item, 'ADD')} className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <PlusCircle size={20} />
                      </button>
                    </div>
                    <p className="font-black text-xl text-slate-900 w-28 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {userCart.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <span className="text-slate-500 font-bold text-lg">Total Amount</span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-2xl shadow-slate-200">
              Complete Payment
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;