import LandingNavbar from '../components/LandingNavbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import HighlightSection from '../components/HighlightSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background overflow-x-hidden">
      <LandingNavbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HighlightSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default LandingPage;
