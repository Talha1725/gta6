"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface AdminSidebarProps {
  children: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: "📊",
      description: "View all emails and preorders",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: "🛍️",
      description: "Manage orders and transactions",
    },
    {
      name: "Generate Preorder",
      href: "/admin/generate-preorder",
      icon: "🎮",
      description: "Create new preorder manually",
    },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 ease-in-out shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/images/logo.svg"
                    alt="GTA 6 Logo"
                    width={50}
                    height={50}
                    priority
                  />
                </Link>
                <div>
                  <h1 className="text-white font-bold text-lg">GTA 6 Admin</h1>
                  <p className="text-gray-400 text-xs">Pre-order Hub</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            >
              {isSidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-75">
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info & Sign Out */}
          <div className="p-4 border-t border-gray-700">
            {isSidebarOpen && (
              <div className="mb-3">
                <div className="text-gray-300 text-sm">Signed in as</div>
                <div className="text-white font-medium truncate">
                  {session?.user?.email}
                </div>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <span className="text-lg">🚪</span>
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
