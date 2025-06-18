"use client";
import React, { useState } from "react";
import SearchBar from "@/components/nfts/SearchBar";
import Tabs from "@/components/nfts/Tabs";
import TrendingCollections from "@/components/nfts/TrendingCollections";
import NotableCollections from "@/components/nfts/NotableCollections";
import Container from "@/components/ui/Container";
import FilterTabs from "@/components/nfts/FilterTabs";

import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";

const NFTMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const handleSearch = (term: string, filter: string) => {
    setSearchTerm(term);
    setSearchFilter(filter);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "notable", label: "Notable Collection" },
    { id: "art", label: "Art" },
  ];

  return (
    <div className="min-h-screen bg-nft-gradient text-white pt-8">
      <main className="max-w-7xl mx-auto">
          <Navigation />
        <Container maxWidth="7xl" padding="sm" className="relative z-10">
          <h1 className="text-4xl font-bold mt-4 mb-6 font-orbitron">
            NFT Marketplace
          </h1>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Trending Collections Section */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-pink-500">Trending</span> Collections
            </h2>
            <TrendingCollections />
          </section>

          {/* Notable Collections Section */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-pink-500">Notable</span> Collections
            </h2>
            <NotableCollections />
          </section>

          {/* Trending Art Section */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-pink-500">Trending</span> Art
            </h2>
            <TrendingCollections isArt={true} />
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default NFTMarketplace;
