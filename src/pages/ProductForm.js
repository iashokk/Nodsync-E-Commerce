// ===== src/pages/ProductForm.jsx =====
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams }     from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Container,
  TextField,
  Stack,
  Typography,
  Alert,
  useTheme
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon             from '@mui/icons-material/Edit';
import CategoryIcon         from '@mui/icons-material/Category';
import MonetizationOnIcon   from '@mui/icons-material/MonetizationOn';
import ImageIcon            from '@mui/icons-material/Image';
import DescriptionIcon      from '@mui/icons-material/Description';

import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../firebase/config';

export default function ProductForm() {
  const theme    = useTheme();
  const { id }   = useParams();  // 'new' or doc ID
  const navigate = useNavigate();
  const isEdit   = id && id !== 'new';

  const [form, setForm]     = useState({
    name: '',
    category: '',
    price: '',
    imageUrl: '',
    description: ''
  });
  const [loading, setLoading] = useState(isEdit);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const snap = await getDoc(doc(db, 'products', id));
          if (snap.exists()) {
            const data = snap.data();
            setForm({
              name: data.name,
              category: data.category,
              price: data.price.toString(),
              imageUrl: data.imageUrl || '',
              description: data.description || ''
            });
          }
        } catch (err) {
          console.error(err);
          setError('Could not load product.');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit]);

  const handleChange = field => e =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price || isNaN(form.price)) {
      setError('Please enter a valid name and numeric price.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name:        form.name,
        category:    form.category,
        price:       parseFloat(form.price),
        imageUrl:    form.imageUrl,
        description: form.description,
        updatedAt:   serverTimestamp()
      };
      if (isEdit) {
        await setDoc(doc(db, 'products', id), payload, { merge: true });
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to save product.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.secondary[100]} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.secondary[100]} 100%)`,
        py: 6
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                {isEdit ? <EditIcon /> : <AddCircleOutlineIcon />}
              </Avatar>
            }
            title={
              <Typography variant="h5">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </Typography>
            }
            sx={{ textAlign: 'center', pt: 3 }}
          />

          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={form.name}
                  onChange={handleChange('name')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex' }}>
                        <CategoryIcon color="action" />
                      </Box>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Category"
                  value={form.category}
                  onChange={handleChange('category')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex' }}>
                        <CategoryIcon color="action" />
                      </Box>
                    )
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Price"
                  value={form.price}
                  onChange={handleChange('price')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex' }}>
                        <MonetizationOnIcon color="action" />
                      </Box>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Image URL"
                  value={form.imageUrl}
                  onChange={handleChange('imageUrl')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex' }}>
                        <ImageIcon color="action" />
                      </Box>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={form.description}
                  onChange={handleChange('description')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex' }}>
                        <DescriptionIcon color="action" />
                      </Box>
                    )
                  }}
                />
              </Stack>
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
            <Button
              onClick={() => navigate('/admin')}
              variant="text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                '&:hover': { opacity: 0.9 }
              }}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
}
