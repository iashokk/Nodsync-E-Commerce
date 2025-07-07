// src/pages/AdminDashboard.jsx
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
  useTheme,
  Tab,
  Tabs
} from '@mui/material';
import AddIcon      from '@mui/icons-material/Add';
import EditIcon     from '@mui/icons-material/Edit';
import DeleteIcon   from '@mui/icons-material/Delete';
import CheckIcon    from '@mui/icons-material/Check';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getDoc }   from 'firebase/firestore';
import { db }       from '../firebase/config';

export default function AdminDashboard() {
  const theme     = useTheme();
  const navigate  = useNavigate();
  const [tab, setTab]               = useState(0);
  const [products, setProducts]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId]   = useState(null);

  // Load products
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

  // Load orders
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'orders'),
      snap => {
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      err => console.error(err)
    );
    return () => unsub();
  }, []);

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'products', toDeleteId));
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  const handleApprove = async (orderId) => {
    await updateDoc(doc(db, 'orders', orderId), { status: 'approved' });
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
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>

        {tab === 0 && (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
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
            <TableContainer component={Paper} elevation={3} sx={{
              borderRadius: 2,
              overflow: 'hidden',
              '& .MuiTableRow-root:nth-of-type(even)': {
                backgroundColor: theme.palette.action.hover
              }
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {['Name','Category','Price','Description','Actions'].map(h => (
                      <TableCell
                        key={h}
                        align={h==='Actions'?'right':'left'}
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
                      <TableCell sx={{
                        maxWidth: 200, whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
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

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this product?
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button color="error" onClick={handleDelete}>Delete</Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {tab === 1 && (
          <>
            <Typography variant="h5" gutterBottom>Orders</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Order ID','User','Items','Total','Status','Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 'bold' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(o => (
                    <OrderRow key={o.id} order={o} onApprove={handleApprove} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </Box>
  );
}

// helper to fetch and display user name, items list
function OrderRow({ order, onApprove }) {
  const [userName, setUserName] = useState(order.userId);
  const itemsText = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
  useEffect(() => {
    // fetch user displayName
    getDoc(doc(db, 'users', order.userId))
      .then(snap => {
        if (snap.exists()) setUserName(snap.data().displayName);
      })
      .catch(console.error);
  }, [order.userId]);

  return (
    <TableRow hover>
      <TableCell>{order.id}</TableCell>
      <TableCell>{userName}</TableCell>
      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {itemsText}
      </TableCell>
      <TableCell>₹{order.total.toFixed(2)}</TableCell>
      <TableCell sx={{ textTransform: 'capitalize' }}>{order.status}</TableCell>
      <TableCell>
        {order.status !== 'approved' && (
          <Tooltip title="Approve">
            <Button
              size="small"
              color="success"
              onClick={() => onApprove(order.id)}
            >
              <CheckIcon fontSize="small" />
            </Button>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}
