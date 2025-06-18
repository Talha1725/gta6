"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import NFTMintModal from '../ui/NFTMintModal'; // Adjust the import path as needed

interface NFTCard {
  id: string;
  title: string;
  image: string;
  price: string;
  priceNote?: string;
  limited?: boolean;
}

const NFTSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<{
    type: 'standard' | 'gold' | 'diamond';
    data: {
      title: string;
      price: string;
      image: string;
      perks: string[];
    };
  } | null>(null);

  const nftCards: NFTCard[] = [
    {
      id: 'standard',
      title: 'Standard NFT',
      image: '/images/nft.png',
      price: '$199'
    },
    {
      id: 'gold',
      title: 'Gold Edition',
      image: '/images/nft.png',
      price: '$499'
    },
    {
      id: 'diamond',
      title: 'Diamond Founder',
      image: '/images/nft.png',
      price: '$999',
      priceNote: 'ONLY 88 AVAILABLE',
      limited: true
    }
  ];

  // NFT data for the modal
  const nftModalData = {
    standard: {
      title: 'Standard NFT',
      price: '$199',
      image: '/images/Standard.svg',
      perks: [
        'Lifetime Free AI Leak Access',
        'Early Access to Pre-Order Deals',
        'Exclusive Discord Channel',
        'Community Voting Rights'
      ]
    },
    gold: {
      title: 'Gold Edition',
      price: '$499',
      image: '/images/Gold.svg',
      perks: [
        'All Standard NFT perks',
        'Priority Customer Support',
        'Monthly Exclusive Content',
        'VIP Discord Role',
        'Beta Feature Access'
      ]
    },
    diamond: {
      title: 'Diamond Founder',
      price: '$999',
      image: '/images/Diamond.svg',
      perks: [
        'All Gold Edition perks',
        'Founder Status & Recognition',
        'Direct Line to Development Team',
        'Revenue Sharing Program',
        'Exclusive Merch & Physical Items',
        'Limited Edition (Only 88 Available)'
      ]
    }
  };

  const handleMintClick = (cardId: string) => {
    const nftType = cardId as 'standard' | 'gold' | 'diamond';
    setSelectedNFT({
      type: nftType,
      data: nftModalData[nftType]
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNFT(null);
  };

  return (
    <section id='nfts-section' className="w-full py-10 md:py-16 bg-black/70">
      <div className="mx-auto px-4 max-w-6xl">
        {/* Section Title - Responsive sizing */}
        <h2 className="text-center text-3xl md:text-5xl font-bold mb-6 md:mb-10">
          <span className="text-yellow-400 font-orbitron">NFT</span>{' '}
          <span className="text-white font-orbitron">COLLECTION</span>
        </h2>
        
        {/* NFT Perks - Stack vertically on mobile */}
        <div className="text-center mb-8 md:mb-16">
          <h3 className="text-white text-lg md:text-xl mb-4 md:mb-6 font-spaceMono">
            NFT Perks for Holders:
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            {[
              'Lifetime Free AI Leak Access',
              'Early Access to Pre-Order Deals',
              'Exclusive Merch & VIP Discord'
            ].map((perk, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                <span className="text-white text-sm md:text-base font-spaceMono">
                  {perk}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* NFT Cards - Adjusted grid for balanced card sizing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-auto max-w-xs sm:max-w-none">
          {nftCards.map((card) => (
            <div 
              key={card.id} 
              className="bg-gray-900 border-2 border-yellow-500/70 rounded-xl overflow-hidden
              flex flex-col h-full transition-all duration-300 hover:border-yellow-400 hover:scale-105"
            >
              {/* NFT Image Container - Slightly reduced aspect ratio */}
              <div className="relative w-full aspect-[16/9] bg-gray-900">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                
                {/* Limited Supply Badge */}
                {card.limited && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">
                    Limited Supply
                  </div>
                )}
              </div>
              
              {/* NFT Info - Adjusted padding and spacing */}
              <div className="p-3 md:p-4 flex flex-col flex-grow">
                <h3 className="text-white text-base md:text-lg font-spaceMono">
                  {card.title}
                </h3>
                
                <div className="flex items-baseline mt-1 mb-4">
                  <span className="text-white text-xl md:text-3xl font-bold font-orbitron">
                    {card.price}
                  </span>
                  {card.priceNote && (
                    <span className="text-gray-400 text-xs ml-2 font-spaceMono">
                      ({card.priceNote})
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={() => handleMintClick(card.id)}
                  className="mt-auto block bg-cyan-400 hover:bg-cyan-500 text-black text-center 
                  py-2 px-4 rounded-full font-medium transition-colors duration-300
                  text-sm md:text-base font-orbitron w-full"
                >
                  Mint Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NFT Mint Modal */}
      {selectedNFT && (
        <NFTMintModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          nftType={selectedNFT.type}
          nftData={selectedNFT.data}
        />
      )}
    </section>
  );
};

export default NFTSection;