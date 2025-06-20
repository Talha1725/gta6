import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import PricingSection from '@/components/sections/PricingSection';
import CountdownSection from '@/components/sections/CountdownSection';
import CryptoSection from '@/components/sections/CryptoSection';
import NFTSection from '@/components/sections/NFTSection';
import MerchSection from '@/components/sections/MerchSection';
import Footer from '@/components/common/Footer';
import Container from '@/components/ui/Container';
import { fetchLatestPreorder } from '@/actions/preorder';

export default async function Home() {
  const preorder = await fetchLatestPreorder();
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full-width hero section */}
      <HeroSection />

      {/* Contained sections */}
      <Container maxWidth="full" padding="none" className="relative z-10">
        <PricingSection />
        <CountdownSection preorder={preorder} />
        <CryptoSection />
        <NFTSection />
        <MerchSection />
      </Container>
      <Footer />
    </div>
  );
}