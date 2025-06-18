"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { SignOutButtonProps } from "@/types";

export default function SignOutButton({
  className = "",
  showText = true,
}: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3.5 text-sm rounded-full transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {showText && <span>Sign Out</span>}
    </button>
  );
}
