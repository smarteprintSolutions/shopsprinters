import React from 'react';
import BottomSlider from './buttomSlider';
import IdentifyPrinter from './identifyPrinter';
import WeProvide from './weProvide';
import HowSetup from './howSetup';
import Hero from './hero';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'HP Printer Setup Guide | Easy Printer Setup & Troubleshooting',
  description:
    'Follow the HP printer setup guide for fast installation, WiFi troubleshooting, driver support, and printer setup help. Expert printer setup guidance and easy fixes in one place.',
  canonical: 'https://shopsprinters.com/easy-setup-guide/',
  openGraph: {
    title: 'HP Printer Setup Guide | Easy Printer Setup & Troubleshooting',
    description:
      'Follow the HP printer setup guide for fast installation, WiFi troubleshooting, driver support, and printer setup help.',
    url: 'https://shopsprinters.com/easy-setup-guide/',
    siteName: 'ShopsPrinters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HP Printer Setup Guide | Easy Printer Setup & Troubleshooting',
    description:
      'Follow the HP printer setup guide for fast installation, WiFi troubleshooting, driver support, and printer setup help.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EasySetupGuide() {
  return (
<>
    <Hero />
    <HowSetup/>
    <WeProvide/>
    <IdentifyPrinter />
    <BottomSlider/>


    <Footer />
</>
  );
}
