import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceCategoryPage from './pages/public/ServiceCategoryPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsOfUsePage from './pages/public/TermsOfUsePage';
import BlogPage from './pages/public/BlogPage';
import BlogPostPage from './pages/public/BlogPostPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManagement from './pages/admin/CategoryManagement';
import TestManagement from './pages/admin/TestManagement';
import CertificationManagement from './pages/admin/CertificationManagement';
import UserManagement from './pages/admin/UserManagement';
import ProfilePage from './pages/admin/ProfilePage';
import ImageManagement from './pages/admin/ImageManagement';
import PartnerManagement from './pages/admin/PartnerManagement';
import BlogManagement from './pages/admin/BlogManagement';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, superAdminOnly = false }) => {
  const { isAuthenticated, isAdmin, isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:categoryId" element={<ServiceCategoryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-of-use" element={<TermsOfUsePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="tests" element={<TestManagement />} />
        <Route path="certifications" element={<CertificationManagement />} />
        <Route path="images" element={<ImageManagement />} />
        <Route path="partners" element={<PartnerManagement />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route 
          path="users" 
          element={
            <ProtectedRoute superAdminOnly>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;
