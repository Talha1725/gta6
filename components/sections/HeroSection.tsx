"use client";
import React from "react";
import Image from "next/image";
import Navigation from "../common/Navigation";
import Button from "../ui/ButtonL";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const handleScrollClick =
    (sectionId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      scrollToSection(sectionId);
    };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gta6-bg.svg"
          alt="GTA 6 Background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-80"
          priority
        />
      </div>

      {/* Content Container - Split into two sections */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Section - Navigation */}
        <div className="w-full">
          <div className="max-w-7xl mt-8 mx-auto">
            <Navigation />
          </div>
        </div>

        {/* Bottom Section - Vertically centered content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-7xl mx-auto w-full px-4">
            <div className="text-center">
              <h1
                className="text-5xl sm:text-5xl md:text-6xl font-bold mb-6 text-pink-500 font-orbitron"
                style={{
                  textShadow: "0 6px 100px rgba(0,0,0), 0 1px 100px #000",
                }}
              >
                #1 GTA6 Pre-Order Hub
              </h1>

              <p className="text-white text-lg md:text-lg mb-12 font-spaceMono font-bold">
                Track Every Leak, Deal & Bonus in Real-Time!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <Button
                  variant="primary"
                  onClick={() => scrollToSection("ai-leak-generator")}
                  className="font-orbitron px-1 h-10 text-[17px]"
                >
                  UNLOCK AI LEAKS - $9.99
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => scrollToSection("countdown-section")}
                  className="font-orbitron px-1 h-10 text-[17px]"
                >
                  JOIN PRE-ORDER TRACKER
                </Button>

                <Link
                  href="https://raydium.io/swap/?inputMint=sol&outputMint=69FpwjVrrcJNbW9MukR8VF1jeHy1ADGN2qxvpr64i9wN"
                  className="neonix-button font-orbitron h-10 px-4 pt-1 text-[17px]"
                >
                  BUY NEONIX COIN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
