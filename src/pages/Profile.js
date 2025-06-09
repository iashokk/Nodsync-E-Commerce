// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Container, Typography, Box, Button } from "@mui/material";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profileData, setData] = useState(null);

  useEffect(() => {
    // Listen for auth state
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch Firestore user doc
        const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setData({
            ...data,
            // Convert Firestore Timestamp to JS Date
            createdAt: data.createdAt.toDate(),
          });
        }
      } else {
        setUser(null);
        setData(null);
      }
    });
    return unsub;
  }, []);

  const handleLogout = () => signOut(auth);

  if (!user) {
    return (
      <Container>
        <Typography variant="h6">You’re not signed in.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="start">
        <Typography variant="h4" gutterBottom>
          Welcome, {user.displayName || profileData?.displayName}
        </Typography>

        <Typography>
          <strong>Email:</strong> {user.email}
        </Typography>

        {profileData && (
          <>
            <Typography>
              <strong>Member since:</strong>{" "}
              {profileData.createdAt.toDateString()}
            </Typography>

            {/* Add more fields here as you extend your user doc */}
          </>
        )}

        <Button variant="outlined" sx={{ mt: 3 }} onClick={handleLogout}>
          Sign Out
        </Button>
      </Box>
    </Container>
  );
}
