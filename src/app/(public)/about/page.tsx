import React from 'react';
import Image from 'next/image';
import StandOut from '@/components/StandOut';
import Commitment from '@/components/Commitment';
import Purpose from '@/components/Purpose';

const AboutPage = () => {
  return (
    <main className="pt-0">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop" 
            alt="Who We Are" 
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-[68px] font-black mb-8 leading-tight">
              Who We Are
            </h1>
            <p className="text-[17px] md:text-[19px] leading-[1.8] opacity-95">
              Shops Printers is an independent online platform dedicated to providing reliable printing products and helpful support to home users, students, small businesses, and office professionals across the United States and Canada. We offer a curated selection of printers, ink, toner, and related accessories sourced from reputable distributors and trusted partners. Our goal is simple: to make printing easy, accessible, and dependable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stand Out Section */}
      <StandOut />

      {/* Commitment Section */}
      <Commitment />

      {/* Purpose Section */}
      <Purpose />
    </main>
  );
};

export default AboutPage;