'use client';

import { useParams } from 'next/navigation';
import NFTDetailPage from '@/components/nfts/NFTDetailPage';

export default function DetailPage() {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return (
    <div className="min-h-screen bg-black text-white">
      <NFTDetailPage productId={productId} />
    </div>
  );
}