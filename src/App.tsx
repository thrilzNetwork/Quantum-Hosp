import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import StoreSection from './components/StoreSection';
import HowItWorks from './components/HowItWorks';
import ImpactSection from './components/ImpactSection';
import FounderSection from './components/FounderSection';
import AboutFounder from './components/AboutFounder';
import BlogSection from './components/BlogSection';
import BookSection from './components/BookSection';
import FreeResource from './components/FreeResource';
import ConsultingSection from './components/ConsultingSection';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import AdminPage from './components/AdminPage';
import UserPage from './components/UserPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductPage from './components/ProductPage';
import ToolsPage from './components/ToolsPage';
import BlogPage from './BlogPage';
import MainLayout from './components/MainLayout';

import { db } from './firebase';
import { doc, getDocFromCache, getDocFromServer, onSnapshot } from 'firebase/firestore';

import { AuthUIProvider } from './context/AuthUIContext';

export default function App() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firestore connection successful");
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();
  }, []);

  // Handle hash scroll on navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [window.location.hash, window.location.pathname]);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.siteName) {
          document.title = data.siteName;
        }
      }
    });
    return unsubSettings;
  }, []);

  return (
    <ErrorBoundary>
      <AuthUIProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={
                  <>
                    <Hero />
                    <HowItWorks />
                    <StoreSection />
                    <BookSection />
                    <AboutFounder />
                    <BlogSection />
                    <FreeResource />
                    <ConsultingSection />
                  </>
                } />
                <Route path="/user" element={
                  <ProtectedRoute>
                    <UserPage />
                  </ProtectedRoute>
                } />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
              </Route>
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </AuthUIProvider>
    </ErrorBoundary>
  );
}
