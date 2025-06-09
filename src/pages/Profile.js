// ===== src/pages/Profile.jsx =====
import React, { useEffect, useState } from 'react';
import { auth, db }                    from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc }                 from 'firebase/firestore';

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
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material';

import EmailIcon         from '@mui/icons-material/Email';
import PhoneIcon         from '@mui/icons-material/Phone';
import HomeIcon          from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function Profile() {
  const theme = useTheme();
  const [user, setUser]               = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfileData({
            ...data,
            createdAt: data.createdAt.toDate()
          });
        }
      } else {
        setUser(null);
        setProfileData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6">
          You’re not signed in. Please{' '}
          <Link href="/signin" underline="hover">
            Sign In
          </Link>.
        </Typography>
      </Container>
    );
  }

  const photo = user.photoURL || profileData?.photoURL;
  const joined = profileData?.createdAt
    ? profileData.createdAt.toLocaleDateString()
    : '';

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
              <Avatar
                src={photo}
                alt={user.displayName || profileData?.displayName}
                sx={{
                  width: 96,
                  height: 96,
                  border: `3px solid ${theme.palette.secondary.main}`
                }}
              />
            }
            title={
              <Typography variant="h4">
                {user.displayName || profileData?.displayName}
              </Typography>
            }
            subheader={
              joined && (
                <Box display="flex" alignItems="center" color="text.secondary">
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    Member since {joined}
                  </Typography>
                </Box>
              )
            }
            sx={{ textAlign: 'center', pt: 4 }}
          />

          <Divider />

          <CardContent>
            <List disablePadding>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user.email}
                />
              </ListItem>

              {profileData?.phoneNumber && (
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={profileData.phoneNumber}
                  />
                </ListItem>
              )}

              {profileData?.address && (
                <ListItem>
                  <ListItemIcon>
                    <HomeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={profileData.address}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>

          <Divider />

          <CardActions sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#fff',
                '&:hover': { opacity: 0.9 }
              }}
              onClick={() => signOut(auth)}
            >
              Sign Out
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
}
