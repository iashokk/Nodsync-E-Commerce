// ===== src/components/Navbar.jsx =====
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';

import MenuIcon         from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth }      from '../contexts/AuthContext';
import { auth }         from '../firebase/config';
import { signOut }      from 'firebase/auth';

export default function Navbar() {
  const theme       = useTheme();
  const isMobile    = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const navigate    = useNavigate();

  const [anchorNav, anchorUser] = [React.useState(null), React.useState(null)];
  const [openNav, setOpenNav]   = anchorNav;
  const [openUser, setOpenUser] = anchorUser;

  const handleNavOpen = e => setOpenNav(e.currentTarget);
  const handleNavClose= () => setOpenNav(null);
  const handleUserOpen = e => setOpenUser(e.currentTarget);
  const handleUserClose= () => setOpenUser(null);

  const handleLogout = async () => {
    handleUserClose();
    await signOut(auth);
    navigate('/signin');
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: '#fff',
              fontWeight: 'bold',
              letterSpacing: 1,
              mr: 2,
              flexGrow: isMobile ? 1 : 0
            }}
          >
            NodSync
          </Typography>

          {/* Desktop menu */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Button
                component={RouterLink}
                to="/shop"
                sx={{ color: '#fff', mx: 1 }}
              >
                Shop
              </Button>

              <IconButton
                component={RouterLink}
                to="/cart"
                sx={{ color: '#fff', mx: 1 }}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          )}

          {/* Auth buttons / avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser ? (
              <IconButton onClick={handleUserOpen} sx={{ p: 0, ml: 2 }}>
                <Avatar
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            ) : !isMobile ? (
              <>
                <Button
                  component={RouterLink}
                  to="/signin"
                  variant="outlined"
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    mr: 1
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  sx={{
                    bgcolor: '#fff',
                    color: theme.palette.primary.main
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : null}

            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                onClick={handleNavOpen}
                sx={{ color: '#fff', ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {/* Mobile drawer menu */}
          <Menu
            anchorEl={openNav}
            open={Boolean(openNav)}
            onClose={handleNavClose}
            keepMounted
          >
            <MenuItem
              component={RouterLink}
              to="/shop"
              onClick={handleNavClose}
            >
              Shop
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/cart"
              onClick={handleNavClose}
            >
              Cart
            </MenuItem>
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => {
                    handleNavClose();
                    navigate('/profile');
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleNavClose(); handleLogout(); }}>
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  component={RouterLink}
                  to="/signin"
                  onClick={handleNavClose}
                >
                  Sign In
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/signup"
                  onClick={handleNavClose}
                >
                  Sign Up
                </MenuItem>
              </>
            )}
          </Menu>

          {/* User avatar menu */}
          <Menu
            anchorEl={openUser}
            open={Boolean(openUser)}
            onClose={handleUserClose}
            keepMounted
          >
            <MenuItem
              onClick={() => {
                handleUserClose();
                navigate('/profile');
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
