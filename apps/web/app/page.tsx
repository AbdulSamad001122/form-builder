import Nav from "./landing/components/Nav";
import Hero from "./landing/components/Hero";
import LogosStrip from "./landing/components/LogosStrip";
import FeatureBuilder from "./landing/components/FeatureBuilder";
import FeatureFieldTypes from "./landing/components/FeatureFieldTypes";
import FeatureVisualLogicAndBranding from "./landing/components/FeatureVisualLogicAndBranding";
import FeatureNotifications from "./landing/components/FeatureNotifications";
import FeatureAnalytics from "./landing/components/FeatureAnalytics";
import Testimonials from "./landing/components/Testimonials";
import Pricing from "./landing/components/Pricing";
import FinalCTA from "./landing/components/FinalCTA";
import Footer from "./landing/components/Footer";

export default function HomePage() {
  return (
    <div className="fl-root">
      <Nav />
      <main id="main-content">
        <Hero />
        <LogosStrip />
        <FeatureBuilder />
        <FeatureFieldTypes />
        <FeatureVisualLogicAndBranding />
        <FeatureNotifications />
        <FeatureAnalytics />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
