"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
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
    { label: 'Pre-Order Tracker', href: '#countdown-section' },
    { label: 'AI Leak Generator', href: '#ai-leak-generator' },
    { label: 'NFTs & Crypto', href: '#nfts-section' },
    { label: 'Subscriptions & Orders', href: '/subscriptions' },
    { label: 'Merch', href: '#merch-section' },
  ];

  // Helper to determine if a section is active (for scrollspy)
  const [activeSection, setActiveSection] = useState<string>('home-section');

  useEffect(() => {
    if (pathname !== '/') return;
    const sectionIds = [
      'home-section',
      'countdown-section',
      'ai-leak-generator',
      'nfts-section',
      'merch-section',
    ];
    const handleScroll = () => {
      let found = 'home-section';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            found = id;
            break;
          }
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

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
      const targetId = item.href.replace('#', '') || 'home-section';
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

  // Close mobile sidebar on scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleScroll = () => setMobileMenuOpen(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  // On mount, if ?scrollTo=section-id is present, scroll to that section
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scrollTo = params.get('scrollTo');
      if (scrollTo) {
        setTimeout(() => {
          handleSmoothScroll(scrollTo);
          // Remove scrollTo param from URL after scrolling
          const url = new URL(window.location.href);
          url.searchParams.delete('scrollTo');
          window.history.replaceState({}, '', url.pathname);
        }, 100);
      }
    }
  }, [pathname]);

  return (
    <header className={`mb-4 ${className || ''}`.trim()}>
      <div className="navbar flex justify-between items-center">
        {/* Logo */}
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
        </div>

        {/* Navigation and actions */}
        <div className="flex-1 flex justify-end items-center gap-6">
          {/* Only show public nav on non-admin pages */}
          {!isAdminArea && (
            <nav className="hidden xl:flex gap-3 xl:gap-6">
              {navItems.map((item) => {
                const isPageLink = item.href === '/subscriptions';
                let isActive = false;
                if (isPageLink) {
                  isActive = pathname === '/subscriptions';
                } else if (pathname === '/') {
                  const sectionId = item.href.replace('#', '') || 'home-section';
                  isActive = activeSection === sectionId;
                }
                // Always highlight Home if on home page and at top
                if (item.label === 'Home' && pathname === '/' && activeSection === 'home-section') {
                  isActive = true;
                }
                return isPageLink ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm hover:text-yellow ${isActive ? 'text-yellow' : ''}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.label}
                    href={
                      pathname === '/'
                        ? item.href
                        : `/?scrollTo=${item.href.replace('#', '')}`
                    }
                    scroll={false}
                    className={`text-sm hover:text-yellow cursor-pointer ${isActive ? 'text-yellow' : ''}`}
                    onClick={e => {
                      if (pathname === '/') {
                        e.preventDefault();
                        const targetId = item.href.replace('#', '') || 'home-section';
                        handleSmoothScroll(targetId);
                      }
                      // If not on home, let Link handle navigation with scrollTo param
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Admin nav for admin pages */}
          {isAdminArea && (
            <nav className="hidden xl:flex gap-6">
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
            className="xl:hidden flex items-center justify-center"
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
          {navItems.map((item) => {
            const isPageLink = item.href === '/subscriptions';
            let isActive = false;
            if (isPageLink) {
              isActive = pathname === '/subscriptions';
            } else if (pathname === '/') {
              const sectionId = item.href.replace('#', '') || 'home-section';
              isActive = activeSection === sectionId;
            }
            if (item.label === 'Home' && pathname === '/' && activeSection === 'home-section') {
              isActive = true;
            }
            return isPageLink ? (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm hover:text-yellow ${isActive ? 'text-yellow' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                href={
                  pathname === '/'
                    ? item.href
                    : `/?scrollTo=${item.href.replace('#', '')}`
                }
                scroll={false}
                className={`text-sm hover:text-yellow cursor-pointer ${isActive ? 'text-yellow' : ''}`}
                onClick={e => {
                  if (pathname === '/') {
                    e.preventDefault();
                    const targetId = item.href.replace('#', '') || 'home-section';
                    handleSmoothScroll(targetId);
                    setMobileMenuOpen(false);
                  }
                  // If not on home, let Link handle navigation with scrollTo param
                }}
              >
                {item.label}
              </Link>
            );
          })}
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
      <p style={{fontSize: "14px", color: "#999", textAlign: "center"}}>
        <span role="img" aria-label="alarm">🚨</span>This is NOT the official GTA 6 site — but it might be better. Parody protected. Merch legendary.
      </p>
    </header>
  );
};

export default Navigation;