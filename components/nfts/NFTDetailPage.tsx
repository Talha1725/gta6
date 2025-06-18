"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  CheckCircle2,
  Eye,
  ExternalLink, BadgeAlert, ListFilter, TrendingUp, NotepadText, Files, BadgeDollarSign, Bookmark, Menu, X,
} from "lucide-react"
import { Button } from "@/components/ui/Button" 
import PriceHistoryChart from "@/pages/DetailPage/components/price-history-chart"
import Navigation from "@/components/common/Navigation"

interface NFTDetailPageProps {
  productId?: string;
}

const NFTDetailPage: React.FC<NFTDetailPageProps> = ({ productId }) => {
  const [expandedSections, setExpandedSections] = useState({
    traits: true,
    priceHistory: true,
    listings: true,
    about: true,
    offers: true,
    details: true,
  })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section as keyof typeof expandedSections],
    })
  }

  // Countdown timer data
  const saleEndTime = new Date("May 10, 2025 4:30 AM")
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date()
    const difference = saleEndTime.getTime() - now.getTime()

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 }
    }

    const hours = Math.floor(difference / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return { hours, minutes, seconds }
  }

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")
      if (sidebar && !sidebar.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (productId) {
      // Fetch product details based on productId
      // Update your state accordingly
    }
  }, [productId])

  return (
    <>
      <div className="min-h-screen bg-nft-gradient text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Navigation />
          {/* Main Content */}
          <main className="max-w-7xl mx-auto p-4 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - NFT Image and Description */}
              <div className="space-y-6">
                {/* NFT Image */}
                <div className="card-bg overflow-hidden">
                  <div>
                    <Image
                      src="/image.png?height=500&width=500"
                      alt="Bored Ape #6138"
                      width={500}
                      height={500}
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>

                {/* Single Description Card with all sections */}
                <div className="card-bg">
                  {/* Description Section */}
                  <div className="p-4 border-b border-[#3A2A45]">
                    <div className="flex items-center gap-2 mb-4">
                      <NotepadText className="w-5 h-5 icon-style" />
                      <h2 className="text-lg font-medium">Description</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>By</span>
                      <span className="text-white font-medium">BoredApeYachtClub</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-500 icon-style" />
                    </div>
                  </div>

                  {/* Traits Section */}
                  <div className="p-4 border-b border-[#3A2A45]">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("traits")}
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-5 h-5 icon-style" />
                        <h2 className="text-lg font-medium">Traits</h2>
                      </div>
                      {expandedSections.traits ? (
                        <ChevronUp className="w-5 h-5 icon-style" />
                      ) : (
                        <ChevronDown className="w-5 h-5 icon-style" />
                      )}
                    </div>

                    {expandedSections.traits && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="bg-[#3A2A45] rounded-lg p-3">
                              <div className="text-xs text-gray-400 uppercase">BACKGROUND</div>
                              <div className="text-sm font-medium">Aquamarine 13%</div>
                              <div className="text-xs text-gray-400 mt-1">Floor: 14.31 ETH</div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* About Section */}
                  <div className="p-4 border-b border-[#3A2A45]">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("about")}
                    >
                      <div className="flex items-center gap-2">
                        <BadgeAlert className="w-5 h-5 icon-style" />
                        <h2 className="text-lg font-medium">About Bored Ape Yacht Club</h2>
                      </div>
                      {expandedSections.about ? (
                        <ChevronUp className="w-5 h-5 icon-style" />
                      ) : (
                        <ChevronDown className="w-5 h-5 icon-style" />
                      )}
                    </div>

                    {expandedSections.about && (
                      <div className="mt-4 text-sm text-gray-300 space-y-3">
                        <p>
                          The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs– unique digital
                          collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club
                          membership card, and grants access to members-only benefits, the first of which is access to THE
                          BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community
                          through roadmap activation.
                        </p>
                        <p>
                          Visit{" "}
                          <a href="#" className="text-pink-500">
                            BoredApeYachtClub.com
                          </a>{" "}
                          for more details.
                        </p>
                        <p className="text-gray-400">Category: PFPs</p>
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="p-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("details")}
                    >
                      <div className="flex items-center gap-2">
                        <Files className="w-5 h-5 icon-style" />
                        <h2 className="text-lg font-medium">Details</h2>
                      </div>
                      {expandedSections.details ? (
                        <ChevronUp className="w-5 h-5 icon-style" />
                      ) : (
                        <ChevronDown className="w-5 h-5 icon-style" />
                      )}
                    </div>

                    {expandedSections.details && (
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contract Address</span>
                          <span className="text-pink-500">0xbc4c...f13d</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Token ID</span>
                          <span className="text-pink-500">6138</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Token Standard</span>
                          <span>ERC-721</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Chain</span>
                          <span>Ethereum</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Metadata</span>
                          <span className="text-pink-500">Frozen</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Creator Earnings</span>
                          <span>1%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - NFT Details and Actions */}
              <div className="space-y-6">
                {/* NFT Title and Info */}
                  <div className="flex items-center gap-2">
                    <h1 className="text-l font-bold text-pink-500">Bored Ape Yacht Club</h1>
                    <CheckCircle2 className="w-5 h-5 text-blue-500 icon-style" />
                  </div>

                  <h2 className="text-3xl font-bold mb-1">#6138</h2>
                  <div className="text-gray-400 mb-4">
                    Owned by <span className="text-pink-500">goooooode</span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Eye className="w-4 h-4 icon-style" />
                      <span>4.7k views</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart className="w-4 h-4 icon-style" />
                      <span>30 favorites</span>
                    </div>
                  </div>
                <div className="card-bg">
                  {/* Sale Countdown */}
                  <div className="border-b border-[#3A2A45]">
                  <div className="mb-6 pl-6 pt-6 pr-6">
                    <div className="text-gray-400 mb-2">Sale ends April 11, 2025 at 4:30 AM</div>
                    <div className="flex gap-4">
                      <div className="countdown-box text-center">
                        <div className="text-2xl font-bold">{timeLeft.hours}</div>
                        <div className="text-sm text-gray-400">Hours</div>
                      </div>
                      <div className="countdown-box text-center">
                        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                        <div className="text-sm text-gray-400">Minutes</div>
                      </div>
                      <div className="countdown-box text-center">
                        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                        <div className="text-sm text-gray-400">Seconds</div>
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Current Price */}
                  <div className="mb-6 pl-6 pt-6 pr-6">
                    <div className="text-gray-400 mb-1">Current Price</div>
                    <div className="flex items-end gap-2 mb-4">
                      <div className="text-3xl font-bold">14.31 ETH</div>
                      <div className="text-gray-400">$22,380.00</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex-1 buy-now-btn">
                            <ShoppingCart className="w-4 h-4 mr-2 icon-style" />
                            Buy Now
                        </Button>
                      <Button className="flex-1 make-offer-btn mt-2 sm:mt-0" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2 icon-style" />
                            Make Offer
                        </Button>
                    </div>
                  </div>
                </div>

                {/* Price History */}
                <div className="card-bg p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection("priceHistory")}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 icon-style" />
                      <h2 className="text-lg font-medium">Price History</h2>
                    </div>
                    {expandedSections.priceHistory ? (
                      <ChevronUp className="w-5 h-5 icon-style" />
                    ) : (
                      <ChevronDown className="w-5 h-5 icon-style" />
                    )}
                  </div>

                  {expandedSections.priceHistory && (
                    <div className="mt-4 h-48">
                      <PriceHistoryChart />
                    </div>
                  )}
                </div>

                {/* Listings */}

                {/* Listings */}
                <div className="section-card">
                  <div className="section-header cursor-pointer" onClick={() => toggleSection("listings")}>
                    <div className="flex items-center gap-2">
                      <ListFilter className="w-4 h-4 pixel-icon" />
                      <h2 className="section-title">Listings</h2>
                    </div>
                    {expandedSections.listings ? (
                        <ChevronUp className="w-4 h-4 pixel-icon" />
                    ) : (
                        <ChevronDown className="w-4 h-4 pixel-icon" />
                    )}
                  </div>

                  {expandedSections.listings && (
                      <div className="overflow-x-auto">
                        {/* Desktop Listings Table */}
                        <div className="hidden md:block">
                          <div className="listing-header">
                            <div>Price</div>
                            <div>USD Price</div>
                            <div>Quantity</div>
                            <div>Expiration</div>
                            <div>From</div>
                            <div></div> {/* Empty header for button column */}
                          </div>

                          {Array(4)
                              .fill(0)
                              .map((_, i) => (
                                  <div key={i} className="pixel-text  listing-row">
                                    <div className="pixel-text">14.25 ETH</div>
                                    <div className="pixel-text">$22,206.34</div>
                                    <div>1</div>
                                    <div>12 hours ago</div>
                                    <div className="text-pink-500">goooooode</div>
                                    <div className="text-right">
                                      <button className="buy-listing-btn">Buy</button>
                                    </div>
                                  </div>
                              ))}
                        </div>

                        {/* Mobile Listings Table */}
                        <div className="md:hidden">
                          {Array(4)
                              .fill(0)
                              .map((_, i) => (
                                  <div key={i} className="pixel-text border-t border-[#3a2a45] p-4">
                                    <div className="flex justify-between mb-2">
                                      <div className="pixel-text font-bold">14.25 ETH</div>
                                      <div className="pixel-text text-gray-400">$22,206.34</div>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <div className="text-gray-400">Quantity:</div>
                                      <div>1</div>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <div className="text-gray-400">Expiration:</div>
                                      <div>12 hours ago</div>
                                    </div>
                                    <div className="flex justify-between mb-3">
                                      <div className="text-gray-400">From:</div>
                                      <div className="text-pink-500">goooooode</div>
                                    </div>
                                    <div className="flex justify-center">
                                    <button className="buy-listing-btn w-72">Buy</button>
                                    </div>
                                  </div>
                              ))}
                        </div>
                      </div>
                  )}
                </div>

                {/* Offers */}
                <div className="card-bg p-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("offers")}>
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign className="w-5 h-5 icon-style" />
                      <h2 className="text-lg font-medium">Offers</h2>
                    </div>
                    {expandedSections.offers ? (
                      <ChevronUp className="w-5 h-5 icon-style" />
                    ) : (
                      <ChevronDown className="w-5 h-5 icon-style" />
                    )}
                  </div>

                  {expandedSections.offers && (
                      <div className="overflow-x-auto">
                        {/* Desktop Offers Table */}
                        <div className="hidden md:block">
                          <div className="listing-header">
                            <div>Price</div>
                            <div>USD Price</div>
                            <div>Quantity</div>
                            <div>Floor Difference</div>
                            <div>Expiration</div>
                            <div>From</div>
                          </div>

                          {Array(4)
                              .fill(0)
                              .map((_, i) => (
                                  <div key={i} className="pixel-text  listing-row">
                                    <div>13.69 ETH</div>
                                    <div>$22,206.34</div>
                                    <div>1</div>
                                    <div>4% below</div>
                                    <div>12 hours ago</div>
                                    <div className="text-pink-500">qwefaes</div>
                                  </div>
                              ))}
                        </div>

                        {/* Mobile Offers Table */}
                        <div className="md:hidden">
                          {Array(4)
                              .fill(0)
                              .map((_, i) => (
                                  <div key={i} className="pixel-text border-t border-[#3a2a45] p-4">
                                    <div className="flex justify-between mb-2">
                                      <div className="pixel-text font-bold">13.69 ETH</div>
                                      <div className="pixel-text text-gray-400">$22,206.34</div>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <div className="text-gray-400">Quantity:</div>
                                      <div>1</div>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <div className="text-gray-400">Floor Difference:</div>
                                      <div>4% below</div>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <div className="text-gray-400">Expiration:</div>
                                      <div>12 hours ago</div>
                                    </div>
                                    <div className="flex justify-between">
                                      <div className="text-gray-400">From:</div>
                                      <div className="text-pink-500">qwefaes</div>
                                    </div>
                                  </div>
                              ))}
                        </div>
                      </div>
                  )}
                </div>
                </div>
              </div>
          </main>
        </div>
      </div>

      <footer className="footer p-5 text-center text-gray-500 text-sm pixel-text">
        <p>Independent from Rockstar Games</p>
        <p>© 2024 GTAG Pre-Order Hub.</p>
      </footer>
    </>
  )
}

export default NFTDetailPage;
