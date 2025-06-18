"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface NFT {
  id: string;
  title: string;
  creator: string;
  image: string;
  price: string;
  verified: boolean;
}

interface NFTCarouselProps {
  nfts: NFT[];
  onNFTClick?: (nft: NFT) => void;
}

const NFTCarousel: React.FC<NFTCarouselProps> = ({ nfts, onNFTClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  
  // Memoized calculation for items per view
  const itemsPerView = useMemo(() => {
    if (viewportWidth < 640) return 1; // Mobile
    if (viewportWidth < 1024) return 2; // Tablet
    return 4; // Desktop
  }, [viewportWidth]);
  
  // Memoized max index calculation
  const maxIndex = useMemo(() => 
    Math.max(0, nfts.length - itemsPerView), 
    [nfts.length, itemsPerView]
  );

  // Optimized resize handler with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportWidth(window.innerWidth);
      }, 100); // Debounce resize events
    };
    
    // Set initial width
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Reset index when itemsPerView changes to prevent out-of-bounds
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex]);

  const nextSlide = useCallback(() => {
    if (!nfts.length) return;
    
    setCurrentIndex(prev => {
      const nextIndex = prev + itemsPerView;
      return nextIndex >= nfts.length ? 0 : nextIndex;
    });
  }, [nfts.length, itemsPerView]);

  const prevSlide = useCallback(() => {
    if (!nfts.length) return;
    
    setCurrentIndex(prev => {
      if (prev === 0) {
        // Go to last complete set
        const lastSetIndex = Math.floor((nfts.length - 1) / itemsPerView) * itemsPerView;
        return lastSetIndex;
      }
      return Math.max(0, prev - itemsPerView);
    });
  }, [nfts.length, itemsPerView]);

  // Early return for empty nfts array
  if (!nfts.length) {
    return (
      <div className="relative p-4 text-center text-gray-500">
        No NFTs available
      </div>
    );
  }

  // Only show visible NFTs for better performance
  const visibleNFTs = useMemo(() => {
    const start = currentIndex;
    const end = Math.min(start + itemsPerView * 2, nfts.length); // Show current + next set
    return nfts.slice(start, end);
  }, [nfts, currentIndex, itemsPerView]);

  return (
    <div className="relative">
      {/* Navigation Buttons - only show if there are multiple sets */}
      {nfts.length > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous NFTs"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next NFTs"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* NFT Cards */}
      <div className="overflow-hidden mx-8">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex % nfts.length) * (100 / itemsPerView)}%)`,
          }}
        >
          {nfts.map((nft, index) => (
            <div
              key={nft.id}
              className={`flex-shrink-0 p-2 ${
                itemsPerView === 1 ? 'w-full' : 
                itemsPerView === 2 ? 'w-1/2' : 'w-1/4'
              }`}
            >
              <div 
                className="bg-[#2A1E35] rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" 
                onClick={() => onNFTClick?.(nft)}
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={nft.image}
                    alt={nft.title}
                    fill
                    sizes={`${100 / itemsPerView}vw`}
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white truncate">{nft.title}</h3>
                  <p className="text-gray-400 text-sm truncate">by {nft.creator}</p>
                  <p className="mt-2 font-medium text-white">{nft.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {nfts.length > itemsPerView && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(nfts.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerView) === index 
                  ? 'bg-cyan-400' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTCarousel;