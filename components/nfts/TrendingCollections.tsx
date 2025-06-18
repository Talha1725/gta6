"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import CollectionTable from "./CollectionTable";
import NFTCarousel from "./NFTCarousel";

interface CollectionProps {
  isArt?: boolean;
}

// Move static data outside component
const COLLECTIONS = [
  {
    id: "courtyard-1",
    name: "Courtyard.io",
    logo: "/images/logo.svg",
    floorPrice: "40 SOL",
    volume: "432 ETH",
    verified: true,
  },
  {
    id: "courtyard-2",
    name: "Courtyard Genesis",
    logo: "/images/logo.svg",
    floorPrice: "35 SOL",
    volume: "385 ETH",
    verified: true,
  },
  {
    id: "courtyard-3",
    name: "Courtyard Elite",
    logo: "/images/logo.svg",
    floorPrice: "42 SOL",
    volume: "456 ETH",
    verified: true,
  },
  {
    id: "courtyard-4",
    name: "Courtyard Rare",
    logo: "/images/logo.svg",
    floorPrice: "38 SOL",
    volume: "398 ETH",
    verified: true,
  },
  {
    id: "courtyard-5",
    name: "Courtyard Premium",
    logo: "/images/logo.svg",
    floorPrice: "45 SOL",
    volume: "512 ETH",
    verified: true,
  },
  {
    id: "courtyard-6",
    name: "Courtyard Classic",
    logo: "/images/logo.svg",
    floorPrice: "33 SOL",
    volume: "367 ETH",
    verified: true,
  },
  {
    id: "courtyard-7",
    name: "Courtyard Limited",
    logo: "/images/logo.svg",
    floorPrice: "48 SOL",
    volume: "578 ETH",
    verified: true,
  },
  {
    id: "courtyard-8",
    name: "Courtyard Special",
    logo: "/images/logo.svg",
    floorPrice: "41 SOL",
    volume: "445 ETH",
    verified: true,
  },
  {
    id: "courtyard-9",
    name: "Courtyard Ultimate",
    logo: "/images/logo.svg",
    floorPrice: "47 SOL",
    volume: "534 ETH",
    verified: true,
  },
  {
    id: "courtyard-10",
    name: "Courtyard Platinum",
    logo: "/images/logo.svg",
    floorPrice: "52 SOL",
    volume: "623 ETH",
    verified: true,
  },
];

const FEATURED_NFTS = [
  {
    id: "bear-nft",
    title: "Bear From The Sky by Gene Logan",
    creator: "Gene Logan",
    image: "/images/gta6-bg.svg",
    price: "0.11 ETH",
    verified: true,
  },
  {
    id: "psycho-nft",
    title: "Psycho Vibes by Gene Logan",
    creator: "Gene Logan",
    image: "/images/project-wise.svg",
    price: "0.15 ETH",
    verified: true,
  },
  {
    id: "neon-nft",
    title: "Neon Dreams by Gene Logan",
    creator: "Gene Logan",
    image: "/images/neon.svg",
    price: "0.12 ETH",
    verified: true,
  },
  {
    id: "cyber-nft",
    title: "Cybernetic Future by Gene Logan",
    creator: "Gene Logan",
    image: "/images/cybernetic.svg",
    price: "0.18 ETH",
    verified: true,
  },
  {
    id: "digital-art-1",
    title: "Digital Horizons by Gene Logan",
    creator: "Gene Logan",
    image: "/images/cybernetic.svg",
    price: "0.14 ETH",
    verified: true,
  },
  {
    id: "future-tech-1",
    title: "Future Tech by Gene Logan",
    creator: "Gene Logan",
    image: "/images/cybernetic.svg",
    price: "0.16 ETH",
    verified: true,
  },
  {
    id: "meta-verse-1",
    title: "MetaVerse Explorer by Gene Logan",
    creator: "Gene Logan",
    image: "/images/cybernetic.svg",
    price: "0.13 ETH",
    verified: true,
  },
  {
    id: "space-odyssey-1",
    title: "Space Odyssey by Gene Logan",
    creator: "Gene Logan",
    image: "/images/cybernetic.svg",
    price: "0.17 ETH",
    verified: true,
  },
];

const ART_NFTS = [
  {
    id: "bear-art",
    title: "Bear From The Sky by Gene Logan",
    creator: "Gene Logan",
    image: "/images/gta6-bg.svg",
    price: "0.11 ETH",
    verified: false,
  },
  {
    id: "psycho-art",
    title: "Psycho Vibes",
    creator: "Gene Logan",
    image: "/images/project-wise.svg",
    price: "0.11 ETH",
    verified: true,
  },
  {
    id: "neon-art",
    title: "Neon Syndicate",
    creator: "Gene Logan",
    image: "/images/neon.svg",
    price: "0.11 ETH",
    verified: false,
  },
  {
    id: "cyber-art",
    title: "Cybernetic Hustler",
    creator: "Gene Logan",
    image: "/images/cybernetic.svg",
    price: "0.11 ETH",
    verified: true,
  },
];

const TIME_FILTERS = [
  { id: "1h", label: "1h" },
  { id: "6h", label: "6h" },
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "all", label: "All" },
] as const;

const TrendingCollections: React.FC<CollectionProps> = ({ isArt = false }) => {
  const [timeFilter, setTimeFilter] = useState("24h");
  const [visibleCollections, setVisibleCollections] = useState(8);
  const router = useRouter();

  const handleNFTClick = useCallback((nft: { id: string }) => {
    router.push(`/nfts/${nft.id}`);
  }, [router]);

  const handleShowMore = useCallback(() => {
    setVisibleCollections(prev => prev + 8);
  }, []);

  // Memoize filtered collections
  const visibleCollectionsList = useMemo(() => 
    COLLECTIONS.slice(0, visibleCollections), 
    [visibleCollections]
  );

  if (isArt) {
    return <NFTCarousel nfts={ART_NFTS} onNFTClick={handleNFTClick} />;
  }

  return (
    <div>
      {/* Featured NFTs Carousel */}
      <div className="mb-8">
        <NFTCarousel 
          nfts={FEATURED_NFTS} 
          onNFTClick={handleNFTClick}
        />
      </div>

      {/* Time Filter Tabs */}
      <div className="flex mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-full md:min-w-0">
          {TIME_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                timeFilter === filter.id
                  ? "bg-cyan-400 text-black"
                  : "bg-[#2A1E35] text-gray-300 hover:bg-cyan-400/20 hover:text-cyan-400"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Collection Table - No onCollectionClick prop needed */}
      <CollectionTable collections={visibleCollectionsList} />

      {/* Show More Button */}
      {visibleCollections < COLLECTIONS.length && (
        <div className="mt-8 text-center">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendingCollections;