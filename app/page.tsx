import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import PricingSection from '@/components/sections/PricingSection';
import CountdownSection from '@/components/sections/CountdownSection';
import CryptoSection from '@/components/sections/CryptoSection';
import NFTSection from '@/components/sections/NFTSection';
import MerchSection from '@/components/sections/MerchSection';
import Footer from '@/components/common/Footer';
import Container from '@/components/ui/Container';
import { fetchLatestPreorderServer } from '@/lib/services/preorder.service';
import { fetchLatestSubscriptionServer } from '@/lib/services/subscription.service'
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const preorder = await fetchLatestPreorderServer();
  const hasActiveSubscription = await fetchLatestSubscriptionServer(cookieHeader);
  console.log('hasActiveSubscription', hasActiveSubscription)
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full-width hero section */}
      <HeroSection />

      {/* Contained sections */}
      <Container maxWidth="full" padding="none" className="relative z-10">
        <PricingSection hasActiveSubscription={hasActiveSubscription} />
        <CountdownSection preorder={preorder} />
        <CryptoSection />
        <NFTSection />
        <MerchSection />
      </Container>
      <Footer />
    </div>
  );
}