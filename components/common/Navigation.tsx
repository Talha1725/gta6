"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignOutButton from '@/components/auth/SignOutButton';


interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(9388);
  const pathname = usePathname();

  // Check if we're in admin area
  const isAdminArea = pathname?.startsWith('/admin');

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Pre-Order Tracker', href: '/pre-order-tracker' },
    { label: 'AI Leak Generator', href: '/leak-generator' },
    { label: 'NFTs & Crypto', href: '/nfts' },
    // @ts-ignore
    ...(session ? [{ label: 'Subscriptions & Orders', href: '/subscriptions' }] : []),
    { label: 'Merch', href: '/merch' },
  ];

  // Map navigation items to their corresponding section IDs
  const getScrollTargetId = (href: string) => {
    switch (href) {
      case '/':
        return 'home-section';
      case '/pre-order-tracker':
        return 'countdown-section';
      case '/leak-generator':
        return 'ai-leak-generator';
      case '/nfts':
        return 'nfts-section';
      case '/merch':
        return 'merch-section';
      case '/legal':
        return 'legal-section';
      default:
        return null;
    }
  };

  // Smooth scroll function
  const handleSmoothScroll = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });

      // Close mobile menu if open
      setMobileMenuOpen(false);
    }
  };

  // Handle navigation click
  const handleNavClick = (item: NavItem, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if we're on the home page and this item has a scroll target
    if (pathname === '/') {
      const targetId = getScrollTargetId(item.href);
      if (targetId) {
        e.preventDefault();
        handleSmoothScroll(targetId);
      }
    }
    // For Home link or other cases, let the normal Link behavior handle navigation
  };

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  // Handle user count updates
  useEffect(() => {
    const updateUsers = () => {
      const userChange = Math.floor(Math.random() * 71) - 20;

      setOnlineUsers(prevCount => {
        const newCount = prevCount + userChange;
        return Math.max(2800, Math.min(9500, newCount));
      });
    };

    const getRandomInterval = () => 5000 + Math.random() * 2000;

    const scheduleNextUpdate = () => {
      const timeoutId = setTimeout(() => {
        updateUsers();
        scheduleNextUpdate();
      }, getRandomInterval());

      return timeoutId;
    };

    const timeoutId = scheduleNextUpdate();

    return () => clearTimeout(timeoutId);
  }, []);

  const formattedUserCount = onlineUsers.toLocaleString();

  return (
    <header className={`mb-4 ${className || ''}`.trim()}>
      <div className="navbar flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.svg"
              alt="GTA 6 Logo"
              width={34}
              height={34}
              priority
            />
          </Link>
        </div>

        {/* Navigation and actions */}
        <div className="flex-1 flex justify-end items-center gap-6">
          {/* Only show public nav on non-admin pages */}
          {!isAdminArea && (
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm hover:text-cyan-400"
                  onClick={(e) => handleNavClick(item, e)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Admin nav for admin pages */}
          {isAdminArea && (
            <nav className="hidden md:flex gap-6">
              <Link href="/admin/dashboard" className="text-sm hover:text-cyan-400">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-sm hover:text-cyan-400">
                Users
              </Link>
              <Link href="/admin/orders" className="text-sm hover:text-cyan-400">
                Orders
              </Link>
              <Link href="/admin/settings" className="text-sm hover:text-cyan-400">
                Settings
              </Link>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!isAdminArea && (
              <>
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  <span className="text-cyan-400">{formattedUserCount} Users Online</span>
                </div>
                {session ? (
                  <SignOutButton />
                ) : (
                  <Link
                    href="/login"
                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-1.5 px-3.5 text-sm rounded-full"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1221] z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } border-r border-[#3a2a45]`}
      >
        <div className="p-4 flex justify-between items-center border-b border-[#3a2a45]">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.svg"
              alt="GTA 6 Logo"
              width={28}
              height={28}
              priority
            />
          </Link>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-4">
          {(isAdminArea ? [
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Users', href: '/admin/users' },
            { label: 'Orders', href: '/admin/orders' },
            { label: 'Settings', href: '/admin/settings' }
          ] : navItems).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm hover:text-cyan-400"
              onClick={(e) => {
                handleNavClick(item, e);
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {!isAdminArea && (
          <div className="p-4 border-t border-[#3a2a45]">
            <div className="text-xs mb-4">
              <span className="text-cyan-400">{formattedUserCount} Users Online</span>
            </div>
            {session ? (
              <SignOutButton className="w-full" />
            ) : (
              <Link
                href="/login"
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-full text-xs py-1 px-3 inline-block text-center"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navigation;