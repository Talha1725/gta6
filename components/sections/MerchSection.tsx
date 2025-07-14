import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MerchItem {
  id: string;
  title: string;
  image: string;
  price: string;
  note?: string;
}

const MerchSection: React.FC = () => {
  const merchItems: MerchItem[] = [
    
    {
      id: "psycho-vibes",
      title: "Neon Drip Signal",
      image: "/images/1.jpg",
      price: "$42",
    },
    {
      id: "synthwave-command",
      title: "Synthwave Command",
      image: "/images/2.jpg",
      price: "$42",
    },
    {
      id: "glitched-access-gateway",
      title: "Glitched Access Gateway",
      image: "/images/3.jpg",
      price: "$42",
    },
    {
      id: "future-echoes-drop",
      title: "Future Echoes Drop",
      image: "/images/4.jpg",
      price: "$42",
    },
    {
      id: "quantum-sync-pulse",
      title: "Quantum Sync Pulse",
      image: "/images/5.jpg",
      price: "$42",
    },
    {
      id: "loading-into-orbit",
      title: "Loading into Orbit",
      image: "/images/6.jpg",
      price: "$88",
      note: "PRE-ORDERS ONLY",
    },
  ];

  return (
    <section id='merch-section' className="w-full py-10 md:pt-20 pb-20 lg:pb-[300px] relative overflow-hidden">
       <div className="bg-gradient-to-tr from-[#00eeff65] to-[#ec18908e] absolute h-[120rem] sm:h-[80rem] lg:h-[50rem] w-full rounded-full blur-[10rem] bottom-[-20%] md:bottom-[-42%] left-1/2 -translate-x-1/2"></div>
      <div className="mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <h2 className="text-center text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          <span className="text-white font-orbitron">EXCLUSIVE</span>{" "}
          <span className="text-pink-500 font-orbitron">MERCH</span>
        </h2>

        {/* Subtitle */}
        <p className="text-center text-white mb-8 md:mb-14 font-spaceMono text-sm md:text-xl font-bold">
          6 Limited Drops Under Wickedly Unique™ Branding
        </p>

        {/* Merch Grid - In-between size for desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mx-auto max-w-xs sm:max-w-none">
          {merchItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 rounded-xl overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 z-50"
            >
              {/* Merch Image - Fixed for Shopify images */}
              <div className="relative w-full overflow-hidden min-h-[15rem] p-3 md:p-4">
                
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={200}
                    style={{ objectFit: "cover" }}
                    className="hover:scale-105 transition-transform duration-300 w-full h-full rounded-xl"
                  />
              </div>

              {/* Merch Info - Balanced padding */}
              <div className="p-3 md:p-4 flex flex-col flex-grow">
                <h3 className="text-white text-base md:text-lg mb-1 md:mb-2 font-spaceMono font-bold">
                  {item.title}
                </h3>
                <div className="flex items-end mt-auto mb-3">
                  <span className="text-white text-lg md:text-3xl font-bold font-orbitron">
                    {item.price}
                  </span>
                  {item.note && (
                    <span className="text-gray-400 text-xs ml-2">
                      {item.note}
                    </span>
                  )}
                </div>

                <Link
                  href={`/merch/${item.id}`}
                  className="block bg-cyan-400 hover:bg-cyan-500 text-black text-center py-1.5 px-4 rounded-full font-bold transition-colors duration-300 text-sm md:text-base font-orbitron"
                >
                  Go to Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSection;