import Nav from "./components/Nav";
import Hero from "./components/Hero";
import LogosStrip from "./components/LogosStrip";
import FeatureBuilder from "./components/FeatureBuilder";
import FeatureFieldTypes from "./components/FeatureFieldTypes";
import FeatureNotifications from "./components/FeatureNotifications";
import FeatureAnalytics from "./components/FeatureAnalytics";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <LogosStrip />
        <FeatureBuilder />
        <FeatureFieldTypes />
        <FeatureNotifications />
        <FeatureAnalytics />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
