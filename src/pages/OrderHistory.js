// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';

export default function OrderHistory() {
  const { currentUser } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no user, clear orders and stop loading
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // User exists → fetch orders
    setLoading(true);
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      snap => {
        setOrders(
          snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      },
      err => {
        console.error('Orders fetch error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!orders.length) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h6">No past orders found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      <List>
        {orders.map(order => {
          const date = order.createdAt instanceof Timestamp
            ? order.createdAt.toDate()
            : new Date(order.createdAt);

          const itemsText = order.items
            .map(i => `${i.name} x${i.quantity}`)
            .join(', ');

          return (
            <React.Fragment key={order.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="h6">Order #{order.id}</Typography>
                      <Chip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        size="small"
                        color={order.status === 'approved' ? 'success' : 'default'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box component="span">
                      <Typography component="span" variant="body2" display="block">
                        <strong>Date:</strong> {date.toLocaleString()}
                      </Typography>
                      <Typography component="span" variant="body2" display="block">
                        <strong>Items:</strong> {itemsText}
                      </Typography>
                      <Typography component="span" variant="body2" display="block">
                        <strong>Total:</strong> ₹{order.total.toFixed(2)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </Container>
  );
}
