import React from "react";
import NFTCarousel from "./NFTCarousel";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotableCollections: React.FC = () => {
  const router = useRouter();

  const collections = [
    {
      id: "bored-ape",
      title: "Bored Ape",
      creator: "Yuga Labs",
      image: "/images/cybernetic.svg",
      price: "0.11 ETH",
      verified: true,
    },
    {
      id: "crypto-punks",
      title: "CryptoPunks",
      creator: "Larva Labs",
      image: "/images/project-wise.svg",
      price: "0.11 ETH",
      verified: true,
    },
    {
      id: "doodles",
      title: "Doodles",
      creator: "Doodles",
      image: "/images/neon.svg",
      price: "2 ETH",
      verified: false,
    },
    {
      id: "azuki",
      title: "Azuki",
      creator: "Chiru Labs",
      image: "/images/dark-web.svg",
      price: "2 ETH",
      verified: true,
    },
    {
      id: "world-of-women",
      title: "World of Women",
      creator: "WoW",
      image: "/images/gold-edition.svg",
      price: "2 ETH",
      verified: false,
    },
  ];

  const handleCollectionClick = (id: string) => {
    router.push(`/nfts/${id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <NFTCarousel 
          nfts={collections} 
          onNFTClick={(nft) => handleCollectionClick(nft.id)}
        />
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/nfts/collections"
          className="inline-block bg-transparent hover:bg-gray-700/50 text-cyan-400 border border-cyan-400 font-medium py-2 px-6 rounded-full transition-colors duration-300"
        >
          View All Collections
        </Link>
      </div>
    </div>
  );
};

export default NotableCollections;
