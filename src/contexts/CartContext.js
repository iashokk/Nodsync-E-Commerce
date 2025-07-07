import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import {
  doc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load / subscribe to Firestore cart when user logs in
  useEffect(() => {
    if (!currentUser) {
      setCartItems([]);
      return;
    }
    const cartRef = doc(db, 'carts', currentUser.uid);
    const unsub = onSnapshot(cartRef, (snap) => {
      if (snap.exists()) {
        setCartItems(snap.data().items);
      } else {
        setCartItems([]);
      }
    });
    return () => unsub();
  }, [currentUser]);

  // Sync local cartItems to Firestore
  useEffect(() => {
    if (!currentUser) return;
    const cartRef = doc(db, 'carts', currentUser.uid);
    setDoc(cartRef, { items: cartItems }, { merge: true })
      .catch(console.error);
  }, [cartItems, currentUser]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += qty;
        return updated;
      }
      return [...prev, { 
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || '',
        quantity: qty
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
