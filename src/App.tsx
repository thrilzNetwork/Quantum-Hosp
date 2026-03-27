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
import ToolDetailPage from './components/ToolDetailPage';
import MainLayout from './components/MainLayout';

import { db } from './firebase';
import { doc, getDocFromCache, getDocFromServer, onSnapshot, collection, getDocs, addDoc } from 'firebase/firestore';

import { AuthUIProvider } from './context/AuthUIContext';

export default function App() {
  useEffect(() => {
    const seedInitialData = async () => {
      try {
        const toolsSnap = await getDocs(collection(db, 'tools'));
        if (toolsSnap.empty) {
          const initialTools = [
            {
              name: 'ATTENDA',
              tag: 'REVENUE',
              headline: 'Turn Every Room Into a Revenue Channel',
              description: "Attenda is Quantum's in-room digital directory — a single interface where guests can browse and order everything the hotel has to offer. Food and beverage, amenities, services, upsells, local experiences — anything the property wants to monetize, Attenda puts it in front of the guest at the right moment. No more missed revenue. No more guests who didn't know the option existed. Attenda turns every room into a revenue channel.",
              features: ['Food & Beverage Ordering', 'Amenities & Services', 'Upsells & Local Experiences', 'Instant Guest Access'],
              useCase: 'Ready to monetize every touchpoint in your property? 📩 Contact Alejandro: alejandro@quantumhospitalitysolutions.com',
              color: 'bg-pink',
              span: 'md:col-span-3',
              productId: ''
            },
            {
              name: 'REVIEWFLOW',
              tag: 'REPUTATION',
              headline: 'Protect Your Reputation. Capture Problems Before They Go Online.',
              description: "ReviewFlow is Quantum's smart guest sentiment tool. Guests scan a QR code and rate their stay — 3 stars or below sends a private alert directly to management, keeping negative feedback internal and actionable. 4 stars and above prompts the guest to share their experience publicly on the platform of their choice. Stop bleeding reputation online. Start intercepting problems at the source and letting your best guests do the marketing.",
              features: ['QR Code Sentiment Capture', 'Private Management Alerts', 'Public Review Prompts', 'Reputation Interception'],
              useCase: 'Want to control your review narrative? 📩 Contact Alejandro: alejandro@quantumhospitalitysolutions.com',
              color: 'bg-pink',
              span: 'md:col-span-3',
              productId: ''
            },
            {
              name: 'EVENTFLOW',
              tag: 'EVENTS',
              headline: 'Every Stakeholder Aligned. Zero Confusion.',
              description: "EventFlow is Quantum's group and event management platform. The hotel inputs all BEO details — schedules, inclusions, parking, contacts, special notes — and two things happen simultaneously. Your team gets a live operational view with everything they need to execute flawlessly. Your group members and meeting planners get a branded client-facing landing page with real-time updates, admin messages, and the ability to interact, make requests, and order directly. One tool. Every stakeholder on the same page. Every time.",
              features: ['Live Operational View', 'Branded Client Landing Page', 'Real-time Updates', 'Direct Interaction & Ordering'],
              useCase: 'Running groups and events at your property? 📩 Contact Alejandro: alejandro@quantumhospitalitysolutions.com',
              color: 'bg-pink',
              span: 'md:col-span-3',
              productId: ''
            },
            {
              name: 'SIGNATUREFLOW',
              tag: 'CULTURE',
              headline: 'Culture Is in Every Touchpoint — Including Your Email Signature.',
              description: "SignatureFlow lives in our Culture category because we believe small details reveal big standards. When your entire team sends emails with the same polished, professional signature — that's not branding. That's culture made visible. SignatureFlow generates beautiful, consistent email signatures for every member of your hotel team so that every message sent, at every level, reflects the same standard of excellence. Culture isn't a poster on the wall. It's in every touchpoint.",
              features: ['Team-wide Consistency', 'Professional Branding', 'Instant Generation', 'Culture Visibility'],
              useCase: 'Want your team to look as good on email as they do in person? 📩 Contact Alejandro: alejandro@quantumhospitalitysolutions.com',
              color: 'bg-pink',
              span: 'md:col-span-3',
              productId: ''
            }
          ];
          for (const tool of initialTools) {
            await addDoc(collection(db, 'tools'), tool);
          }
          console.log("Initial tools seeded successfully");
        }

        const productsSnap = await getDocs(collection(db, 'products'));
        if (productsSnap.empty) {
          const initialProducts = [
            {
              name: 'ATTENDA',
              headline: 'Turn Every Room Into a Revenue Channel',
              description: "Attenda is Quantum's in-room digital directory — a single interface where guests can browse and order everything the hotel has to offer.",
              price: 0,
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
              category: 'tool',
              contactOnly: true,
              heroBenefits: ['Monetize every touchpoint', 'Instant guest access', 'Zero friction ordering'],
              features: ['F&B Ordering', 'Amenity Requests', 'Local Experiences', 'Upsell Engine']
            },
            {
              name: 'REVIEWFLOW',
              headline: 'Protect Your Reputation. Capture Problems Before They Go Online.',
              description: "ReviewFlow is Quantum's smart guest sentiment tool. Intercept problems at the source.",
              price: 0,
              image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000',
              category: 'tool',
              contactOnly: true,
              heroBenefits: ['Intercept negative feedback', 'Boost positive reviews', 'Real-time alerts'],
              features: ['QR Sentiment Capture', 'Private Alerts', 'Public Prompts', 'Management Dashboard']
            },
            {
              name: 'EVENTFLOW',
              headline: 'Every Stakeholder Aligned. Zero Confusion.',
              description: "EventFlow is Quantum's group and event management platform. One tool. Every stakeholder on the same page.",
              price: 0,
              image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
              category: 'tool',
              contactOnly: true,
              heroBenefits: ['Flawless execution', 'Branded client pages', 'Real-time updates'],
              features: ['BEO Management', 'Client Portal', 'Admin Messaging', 'Direct Ordering']
            },
            {
              name: 'SIGNATUREFLOW',
              headline: 'Culture Is in Every Touchpoint — Including Your Email Signature.',
              description: "SignatureFlow generates beautiful, consistent email signatures for every member of your hotel team.",
              price: 0,
              image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=1000',
              category: 'tool',
              contactOnly: true,
              heroBenefits: ['Team-wide consistency', 'Professional branding', 'Culture visibility'],
              features: ['Instant Generation', 'Brand Alignment', 'Easy Deployment', 'Standardized Design']
            }
          ];
          for (const product of initialProducts) {
            await addDoc(collection(db, 'products'), product);
          }
          console.log("Initial products seeded successfully");
        }
      } catch (error) {
        console.error("Error seeding initial data:", error);
      }
    };
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
    seedInitialData();
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
                <Route path="/tool/:id" element={<ToolDetailPage />} />
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
