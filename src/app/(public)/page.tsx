import { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import QualitySection from '@/components/QualitySection';
import Testimonials from '@/components/Testimonials';
import HowItWorks from '@/components/HowItWorks';

export const metadata: Metadata = {
  title: 'Home - ShopsPrinters',
  description: 'Welcome to ShopsPrinters. Quality printer supplies and expert setup support.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedProducts />
      <QualitySection />
      <Testimonials />
      <HowItWorks />
    </main>
  );
}