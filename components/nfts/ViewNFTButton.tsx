import React from "react";
import Link from "next/link";

interface ViewNFTButtonProps {
  href: string;
}

const ViewNFTButton: React.FC<ViewNFTButtonProps> = ({ href }) => {
  return (
    <Link
      href={href}
      className="bg-cyan-400 hover:bg-cyan-500 text-black text-sm font-medium rounded-full px-4 py-2 transition-colors duration-300 inline-flex items-center justify-center"
    >
      View NFT
    </Link>
  );
};

export default ViewNFTButton;
