import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface CollectionCardProps {
  id: string;
  title: string;
  image: string;
  price: string;
  volume?: string;
  verified?: boolean;
  isArt?: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  id,
  title,
  image,
  price,
  volume = "0 ETH",
  verified = false,
  isArt = false,
}) => {
  return (
    <Link href={`/nfts/collection/${id}`}>
      <div className="rounded-lg overflow-hidden bg-[#2A1E35] hover:shadow-lg transition-all duration-300 flex flex-col font-spaceMono">
        {/* Image Container */}
        <div className="relative w-full aspect-square">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 hover:scale-105"
          />
          {verified && (
            <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-3">
          {/* Title with verification */}
          <div className="flex items-center mb-2">
            <h3 className="text-white font-medium font-spaceMono truncate">
              {title}
            </h3>
          </div>

          {/* Price info */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400 font-spaceMono">Price</p>
              <p className="text-white font-bold font-spaceMono">{price}</p>
            </div>
            {!isArt && (
              <div className="text-right">
                <p className="text-sm text-gray-400 font-spaceMono">Volume</p>
                <p className="text-white font-bold font-spaceMono">{volume}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;