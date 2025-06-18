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
      image: "https://cdn.shopify.com/s/files/1/0553/9912/0992/files/unisex-staple-t-shirt-black-heather-front-680d74b610b5d.jpg?v=1746570261",
      price: "$42",
    },
    {
      id: "Synthwave Command",
      title: "Synthwave Command",
      image: "https://cdn.shopify.com/s/files/1/0553/9912/0992/files/unisex-staple-t-shirt-black-heather-front-6804d47ff37f8.jpg?v=1746569073",
      price: "$42",
    },
    {
      id: "Glitched Access Gateway",
      title: "Glitched Access Gateway",
      image: "https://cdn.shopify.com/s/files/1/0553/9912/0992/files/unisex-staple-t-shirt-black-heather-front-6804d3534bcb4.jpg?v=1746568956",
      price: "$42",
    },
    {
      id: "Future Echoes Drop",
      title: "Future Echoes Drop",
      image: "https://cdn.shopify.com/s/files/1/0553/9912/0992/files/unisex-staple-t-shirt-black-heather-front-6804d2049e806.jpg?v=1746569161",
      price: "$42",
    },
    {
      id: "Quantum Sync Pulse",
      title: "Quantum Sync Pulse",
      image: "https://cdn.shopify.com/s/files/1/0553/9912/0992/files/unisex-staple-t-shirt-black-heather-front-6804d4f447342.jpg?v=1746569225",
      price: "$42",
    },
    {
      id: "Loading into Orbit",
      title: "Loading into Orbit",
      image: "https://cdn.shopify.com/s/files/1/0553/9912/0992/files/unisex-premium-hoodie-black-front-6804c90529f71.jpg?v=1746610971",
      price: "$88",
      note: "PRE-ORDERS ONLY",
    },
  ];

  return (
    <section id='merch-section' className="w-full py-10 md:py-20 bg-gradient-to-b from-black to-purple-900/30">
      <div className="mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <h2 className="text-center text-3xl md:text-5xl font-bold mb-6 md:mb-8">
          <span className="text-white font-orbitron">EXCLUSIVE</span>{" "}
          <span className="text-pink-500 font-orbitron">MERCH</span>
        </h2>

        {/* Subtitle */}
        <p className="text-center text-white mb-8 md:mb-14 font-spaceMono text-sm md:text-base">
          6 Limited Drops Under Wickedly Unique™ Branding
        </p>

        {/* Merch Grid - In-between size for desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mx-auto max-w-xs sm:max-w-none">
          {merchItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900/40 rounded-xl overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300"
            >
              {/* Merch Image - Fixed for Shopify images */}
              <div className="relative w-full aspect-[4/4] bg-gray-800 overflow-hidden">
                {item.image.startsWith('https://cdn.shopify.com') ? (
                  /* Use regular img tag for Shopify images */
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  /* Use Next.js Image for local images */
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Merch Info - Balanced padding */}
              <div className="p-3 md:p-4 flex flex-col flex-grow">
                <h3 className="text-white text-base md:text-lg mb-1 md:mb-2 font-spaceMono">
                  {item.title}
                </h3>
                <div className="flex items-end mt-auto mb-3">
                  <span className="text-white text-lg md:text-xl font-bold">
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
                  className="block bg-cyan-400 hover:bg-cyan-500 text-black text-center py-1.5 px-4 rounded-full font-medium transition-colors duration-300 text-sm md:text-base"
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