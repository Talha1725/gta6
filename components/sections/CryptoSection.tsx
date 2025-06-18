import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CryptoSection: React.FC = () => {
  return (
    <section 
      className="w-full flex items-center"
      style={{
        background: 'linear-gradient(to top, #000000, #0d1b3a, #0e1e50)',
        // boxShadow: 'inset 0 0 100px rgba(0, 255, 255, 0.2)'
      }}
    >
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
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-center">
            <span className="text-pink-500 font-orbitron">NEONIX COIN</span>
            <span className="text-white"> - Crypto Purchase,</span>
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white text-center">
            Staking & Early Access
          </h2>
          
          {/* Crypto Utility */}
          <div className="mb-12 w-full max-w-3xl mx-auto">
            <h3 className="text-white text-xl font-medium mb-6 font-spaceMono text-center md:text-left">
              Crypto Utility:
            </h3>
            
            <div className="flex flex-col items-start mx-auto space-y-10">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-3"></div>
                <span className="text-white text-left font-spaceMono">Unlocks AI Leaks & Merch Discounts</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-3"></div>
                <span className="text-white text-left font-spaceMono">Stake for Passive Income Rewards</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-3"></div>
                <span className="text-white text-left font-spaceMono">Future In-Game Purchases (Pending Mod Integration)</span>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
            <Link 
              href="https://raydium.io/swap/?inputMint=sol&outputMint=69FpwjVrrcJNbW9MukR8VF1jeHy1ADGN2qxvpr64i9wN" 
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-3 px-8 rounded-full transition-colors duration-300"
            >
              BUY NEONIX ON RAYDIUM
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptoSection;