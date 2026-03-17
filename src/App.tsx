import Header from './components/Header';
import Hero from './components/Hero';
import OperationsSection from './components/OperationsSection';
import HowItWorks from './components/HowItWorks';
import ImpactSection from './components/ImpactSection';
import FounderSection from './components/FounderSection';
import FreeResource from './components/FreeResource';
import ConsultingSection from './components/ConsultingSection';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <Header />
      <main className="flex-1">
        <Hero />
        <OperationsSection />
        <HowItWorks />
        <ImpactSection />
        <FounderSection />
        <FreeResource />
        <ConsultingSection />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
