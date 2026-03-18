import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import OperationsSection from './components/OperationsSection';
import StoreSection from './components/StoreSection';
import HowItWorks from './components/HowItWorks';
import ImpactSection from './components/ImpactSection';
import FounderSection from './components/FounderSection';
import FreeResource from './components/FreeResource';
import ConsultingSection from './components/ConsultingSection';
import Footer from './components/Footer';
import CartModal from './components/CartModal';

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Hero />
            <OperationsSection />
            <StoreSection />
            <HowItWorks />
            <ImpactSection />
            <FounderSection />
            <FreeResource />
            <ConsultingSection />
          </main>
          <Footer />
          <CartModal />
        </div>
      </CartProvider>
    </ErrorBoundary>
  );
}
