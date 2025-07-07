import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert
} from '@mui/material';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      setError('Please provide shipping address and phone.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        items: cartItems,
        shipping: { address, phone },
        total,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Shipping Address"
          multiline
          rows={3}
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
        <TextField
          label="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <Typography variant="h6">Order Total: ₹{total.toFixed(2)}</Typography>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Placing Order…' : 'Place Order'}
        </Button>
      </Box>
    </Container>
  );
}
