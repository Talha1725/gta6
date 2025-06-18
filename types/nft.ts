export interface NFTMintModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftType: "standard" | "gold" | "diamond";
  nftData: {
    title: string;
    price: string;
    image: string;
    perks: string[];
  };
}

export interface CollectionRowProps {
  rank: number;
  id: string;
  name: string;
  logo: string;
  floorPrice: string;
  volume: string;
  verified?: boolean;
}

export interface NFTCardProps {
  id: string;
  title: string;
  creator: string;
  image: string;
  price: string;
  creatorLogo?: string;
}

export interface NFTCollection {
  id: string;
  name: string;
  logo: string;
  floorPrice: string;
  volume: string;
  verified: boolean;
  rank: number;
}

export interface NFTItem {
  id: string;
  title: string;
  creator: string;
  image: string;
  price: string;
  creatorLogo?: string;
  collection?: string;
} 