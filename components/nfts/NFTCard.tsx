import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NFTCardProps } from "@/types";

const NFTCard: React.FC<NFTCardProps> = ({
  id,
  title,
  creator,
  image,
  price,
  creatorLogo,
}) => {
  return (
    <Link href={`/nfts/${id}`}>
      <div className="rounded-xl overflow-hidden bg-[#2A1E35] hover:shadow-lg transition-all duration-300 flex flex-col h-full font-spaceMono">
        {/* NFT Image */}
        <div className="relative w-full aspect-square">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* NFT Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-white font-medium font-spaceMono truncate">
            {title}
          </h3>

          {/* Creator info */}
          <div className="flex items-center mb-4">
            <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-700 flex-shrink-0">
              {creatorLogo && (
                <Image
                  src={creatorLogo}
                  alt={`${creator} avatar`}
                  fill
                  sizes="24px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <span className="text-sm text-gray-300 truncate">{creator}</span>
          </div>

          {/* Price */}
          <div className="mt-auto">
            <p className="text-sm text-gray-400 font-spaceMono">Price</p>
            <p className="text-white font-bold font-spaceMono">{price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;
