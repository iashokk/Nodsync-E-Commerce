// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute   from './components/PrivateRoute';
import Navbar       from './components/Navbar';
import SignIn     from './pages/SignIn';
import SignUp     from './pages/SignUp';
import Profile    from './pages/Profile';
import Home       from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProductForm from './pages/ProductForm';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          {/* public */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/admin" element={
  <PrivateRoute>
    <AdminDashboard />
  </PrivateRoute>
}/>
<Route path="/admin/product/:id" element={
  <PrivateRoute>
    <ProductForm />
  </PrivateRoute>
}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
