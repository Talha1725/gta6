import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { CollectionRowProps } from "@/types";

const CollectionRow: React.FC<CollectionRowProps> = ({
  rank,
  id,
  name,
  logo,
  floorPrice,
  volume,
  verified = false,
}) => {
  return (
    <tr className="border-b border-gray-800 hover:bg-[#2A1E35] transition-colors font-spaceMono">
      <td className="py-4 px-2 text-center">{rank}</td>
      <td className="py-4 px-2">
        <Link href={`/nfts/${id}`} className="flex items-center">
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image src={logo} alt={name} fill style={{ objectFit: "cover" }} />
          </div>
          <span className="font-medium text-white">{name}</span>
          {verified && <CheckCircle className="ml-2 w-4 h-4 text-cyan-400" />}
        </Link>
      </td>
      <td className="py-4 px-2 text-right font-spaceMono">{floorPrice}</td>
      <td className="py-4 px-2 text-right font-spaceMono">{volume}</td>
    </tr>
  );
};

export default CollectionRow;
