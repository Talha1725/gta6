"use client";
import React, { useState } from "react";
import PaymentModal from "../PaymentModal";
import { useSession } from "next-auth/react";

interface PricingTier {
  type: string;
  badge: string;
  badgeColor: string;
  leaks: string;
  price: number; 
  displayPrice: string;
  currency: string; 
  purchaseType: 'one_time' | 'monthly';
  totalLeaks?: number;  
}

const PricingSection: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();

  console.log("data: session, status", session, status);
  const pricingTiers: PricingTier[] = [
    {
      type: "Common",
      badge: "bg-blue-500",
      badgeColor: "text-blue-400",
      leaks: "1 Leak",
      price: 9.99,
      displayPrice: "$9.99",
      currency: "USD",
      purchaseType: "one_time",
      totalLeaks: 1
    },
    {
      type: "Rare",
      badge: "bg-yellow-500",
      badgeColor: "text-yellow-400",
      leaks: "3 Leaks",
      price: 14.99,
      displayPrice: "$14.99",
      currency: "USD",
      purchaseType: "one_time",
      totalLeaks: 3
    },
    {
      type: "Legendary",
      badge: "bg-red-500",
      badgeColor: "text-red-400",
      leaks: "10 Leaks",
      price: 39.99,
      displayPrice: "$39.99",
      currency: "USD",
      purchaseType: "one_time",
      totalLeaks: 10
    },
    {
      type: "Monthly Subscription",
      badge: "bg-pink-500",
      badgeColor: "text-pink-400",
      leaks: "Unlimited Access",
      price: 149.99,
      displayPrice: "$149.99",
      currency: "USD",
      purchaseType: "monthly"
    },
  ];

  const handlePurchase = (tier: PricingTier) => {
    console.log("🛍️ Starting purchase flow:", {
      tier: tier.type,
      amount: tier.price,
      currency: tier.currency,
      product: `${tier.type} - ${tier.leaks}`,
      purchaseType: tier.purchaseType,
      totalLeaks: tier.totalLeaks
    });
    setSelectedTier(tier);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("❌ Payment modal closed");
    setShowModal(false);
    setSelectedTier(null);
  };

  return (
    <section
      id="ai-leak-generator"
      className="w-full py-20 bg-gradient-to-b from-black to-purple-900/30"
    >
      <div className="mx-auto px-4 py-10" style={{ maxWidth: "1247px" }}>
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          AI Leak Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-15 px-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.type}
              className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-800/50 transition-transform hover:scale-105 flex flex-col h-full"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center mb-4 h-8">
                  <div
                    className={`w-3 h-3 rounded-full ${tier.badge} mr-2`}
                  ></div>
                  <span className={`font-medium ${tier.badgeColor}`}>
                    {tier.type}
                  </span>
                </div>

                <div className="text-white text-xl mb-4 min-h-[3rem] flex items-center">
                  {tier.leaks}
                </div>

                <div className="text-white text-3xl font-bold mb-6">
                  {tier.displayPrice}
                </div>

                <div className="flex-1"></div>

                <button
                  onClick={() => handlePurchase(tier)}
                  className="block bg-green-400 hover:bg-green-500 text-black text-center py-3 px-4 rounded-full font-medium transition-colors mt-auto"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-white">
          <p className="font-spaceMono">
            Want a FREE Leak? Share on{" "}
            <a
              href="https://twitter.com"
              className="text-cyan-400 hover:underline"
            >
              Twitter
            </a>{" "}
            &{" "}
            <a
              href="https://tiktok.com"
              className="text-cyan-400 hover:underline"
            >
              TikTok!
            </a>
          </p>
        </div>
      </div>

      {selectedTier && (
        <PaymentModal
          isOpen={showModal}
          onClose={handleCloseModal}
          amount={selectedTier.price}
          currency={selectedTier.currency}
          productName={`${selectedTier.type} - ${selectedTier.leaks}`}
          purchaseType={selectedTier.purchaseType}
          totalLeaks={selectedTier.totalLeaks}
        />
      )}
    </section>
  );
};

export default PricingSection;
