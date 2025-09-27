import Header from './components/sections/header';
import Hero from './components/sections/hero';
import { Statistics } from './components/sections/statistics';
import Features from './components/sections/features';
import Demo from './components/sections/demo';
import Pricing from './components/sections/pricing';
import Testimonials from './components/sections/testimonials';
import Contact from './components/sections/contact';
import Footer from './components/sections/footer';
import { PageTransition, SmoothScroll } from './components/animations';

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen">
        <SmoothScroll offset={80} />
        <Header />
        <Hero />
        <Statistics />
        <Features />
        <Demo />
        <Pricing />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </PageTransition>
  );
}
