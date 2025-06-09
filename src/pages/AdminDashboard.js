// ===== src/pages/AdminDashboard.jsx =====
import React, { useEffect, useState }         from 'react';
import { useNavigate, Link as RouterLink }    from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Typography,
  Tooltip,
  useTheme
}                                              from '@mui/material';
import AddIcon          from '@mui/icons-material/Add';
import EditIcon         from '@mui/icons-material/Edit';
import DeleteIcon       from '@mui/icons-material/Delete';
import { collection, onSnapshot, doc, deleteDoc }
                                              from 'firebase/firestore';
import { db }           from '../firebase/config';

export default function AdminDashboard() {
  const theme     = useTheme();
  const navigate  = useNavigate();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId]   = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'products', toDeleteId));
    setConfirmOpen(false);
    setToDeleteId(null);
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
      <Container maxWidth="lg">
        {/* Page header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Admin Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/admin/product/new"
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: '#fff',
              '&:hover': { opacity: 0.9 }
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Products table */}
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            // alternate row shading
            '& .MuiTableRow-root:nth-of-type(even)': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['Name', 'Category', 'Price', 'Description', 'Actions'].map(h => (
                  <TableCell
                    key={h}
                    align={h === 'Actions' ? 'right' : 'left'}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 'bold'
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(prod => (
                <TableRow key={prod.id} hover>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.category}</TableCell>
                  <TableCell>₹{prod.price}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {prod.description}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <Button size="small" onClick={() => navigate(`/admin/product/${prod.id}`)}>
                        <EditIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setToDeleteId(prod.id);
                          setConfirmOpen(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
