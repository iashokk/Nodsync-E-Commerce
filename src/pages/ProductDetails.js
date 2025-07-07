// ===== src/pages/ProductDetails.jsx =====
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }      from 'react-router-dom';
import { doc, getDoc }                  from 'firebase/firestore';
import { db }                           from '../firebase/config';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  CardMedia
} from '@mui/material';
import { useCart } from '../contexts/CartContext'; // Assuming you have a CartContext to manage cart state
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
const { addToCart } = useCart(); // Assuming you have a CartContext to manage cart state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);     // ← actually add 1 quantity of this product
    navigate('/cart');   
   
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h6">Product not found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {product.imageUrl && (
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.name}
            sx={{ width: { md: 400 }, height: 'auto', borderRadius: 2 }}
          />
        )}
        <Box flex={1}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            ₹{product.price}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Button variant="contained" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
