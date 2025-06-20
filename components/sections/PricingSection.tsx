"use client";
import React, { useState } from "react";
import PaymentModal from "../PaymentModal";
import { useSession } from "next-auth/react";
import { PRICING_TIERS, PricingTier, PRODUCTS } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface PricingSectionProps {
  hasActiveSubscription: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ hasActiveSubscription }) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("data: session, status", session, status);

  const pricingTiers: PricingTier[] = PRICING_TIERS;

  const handlePurchase = (tier: PricingTier) => {
    if (!session) {
      router.push('/login');
      return;
    }
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
      className="w-full py-20 bg-black relative overflow-hidden"
    >
      <div className="bg-gradient-to-tr from-[#00eeff75] to-[#ec18909c] absolute h-[50rem] w-full rounded-full blur-[10rem] bottom-[-80%] left-1/2 -translate-x-1/2"></div>
      <div className="mx-auto px-4 py-10" style={{ maxWidth: "1247px" }}>
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 font-orbitron">
          AI Leak Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 px-4">
          {pricingTiers.map((tier) => {
            const isUnlimitedTier = tier.type === PRODUCTS.subscription.name;
            const isDisabled = isUnlimitedTier && hasActiveSubscription;

            return (
              <div
                key={tier.type}
                className={`bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 flex flex-col h-full ${isDisabled ? 'opacity-70' : ''}`}
              >
                <div className="py-7 px-6 flex flex-col flex-1">
                  <div className="flex items-center mb-1">
                    <div
                      className={`w-3 h-3 rounded-full ${tier.badge} mr-2`}
                    ></div>
                    <span className={`font-medium text-sm ${tier.badgeColor}`}>
                      {tier.type}
                    </span>
                  </div>

                  <div className="text-white text-md font-bold mb-1 h-[3rem] flex items-center">
                    {tier.leaks}
                  </div>

                  <div className="text-white text-3xl font-bold mb-1 font-orbitron">
                    {tier.displayPrice}
                  </div>

                  <button
                    onClick={() => handlePurchase(tier)}
                    disabled={isDisabled}
                    className={`block text-center py-2 px-4 mt-4 rounded-full font-bold transition-colors font-orbitron ${
                      isDisabled
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-green hover:bg-green-500 text-black'
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
          <p className="font-spaceMono font-bold z-50 relative">
            Want a FREE Leak? Share on{" "}
            <a
              href="https://twitter.com"
              className="text-green underline"
            >
              Twitter
            </a>{" "}
            &{" "}
            <a
              href="https://tiktok.com"
              className="text-green underline"
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
