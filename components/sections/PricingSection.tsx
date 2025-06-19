"use client";
import React, { useState } from "react";
import PaymentModal from "../PaymentModal";
import { useSession } from "next-auth/react";
import { PRICING_TIERS, PricingTier, PRODUCTS } from "@/lib/constants";

interface PricingSectionProps {
  hasActiveSubscription: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ hasActiveSubscription }) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();

  console.log("data: session, status", session, status);

  const pricingTiers: PricingTier[] = PRICING_TIERS;

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
          {pricingTiers.map((tier) => {
            const isUnlimitedTier = tier.type === PRODUCTS.subscription.name;
            const isDisabled = isUnlimitedTier && hasActiveSubscription;

            return (
              <div
                key={tier.type}
                className={`bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-800/50 transition-transform hover:scale-105 flex flex-col h-full ${isDisabled ? 'opacity-70' : ''}`}
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
                    disabled={isDisabled}
                    className={`block text-center py-3 px-4 rounded-full font-medium transition-colors mt-auto ${
                      isDisabled
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-green-400 hover:bg-green-500 text-black'
                    }`}
                  >
                    {isDisabled ? 'Subscribed' : 'Buy Now'}
                  </button>
                </div>
              </div>
            );
          })}
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
