import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/ButtonL';

const CryptoSection: React.FC = () => {
  return (
    <section 
      className="w-full flex items-center relative overflow-hidden"
    >
      <div className="bg-gradient-to-tr from-[#00eeffa1] to-[#ec189070] absolute h-[50rem] w-full rounded-full blur-[10rem] top-[-40%] left-1/2 -translate-x-1/2"></div>
      <div 
        className="mx-auto px-4 py-24 md:py-32" 
        style={{ maxWidth: '1247px' }}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Coin Logo */}
          <div className="flex justify-center mb-10">
            <div className="relative w-28 h-28 md:w-32 md:h-32">
              <Image
                src="/images/logo.svg" 
                alt="Neonix Coin"
                className="animate-spin-slow"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
          
          {/* Main Heading */}
          <h2 className="lg:w-[80%] text-4xl md:text-5xl font-bold z-20 relative mb-2 text-center">
            <span className="text-pink-500 font-orbitron">NEON6IX COIN</span>
            <span className="text-white font-orbitron leading-normal"> - Crypto Purchase, Staking & Early Access</span>
          </h2>
          
          {/* Crypto Utility */}
          <div className="mb-12 w-full max-w-3xl mx-auto z-40">
            <h3 className="text-white text-xl font-semibold mb-6 font-spaceMono text-center">
              Crypto Utility:
            </h3>
            
            <div className="flex flex-col items-center mx-auto space-y-5">
              <div className="flex justify-center items-center">
                <div className="w-3 h-3 rounded-full bg-yellow mr-3"></div>
                <span className="text-white text-left font-spaceMono">Unlocks AI Leaks & Merch Discounts</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow mr-3"></div>
                <span className="text-white text-left font-spaceMono">Stake for Passive Income Rewards</span>
              </div>
              
              <div className="flex items-center">
                <div className="min-w-3 h-3 rounded-full bg-yellow mr-3"></div>
                <span className="text-white text-left font-spaceMono">Future In-Game Purchases (Pending Mod Integration)</span>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              href="https://raydium.io/swap/?inputMint=sol&outputMint=69FpwjVrrcJNbW9MukR8VF1jeHy1ADGN2qxvpr64i9wN">
            <Button
                  variant="primary"
                  className="font-orbitron px-1 h-10 text-[17px]"
                >
                 Buy Neon6IX on Raydium
                </Button>
                </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptoSection;