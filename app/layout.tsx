import type { Metadata } from "next";
import localFont from "next/font/local";
import { Orbitron, Space_Mono } from "next/font/google";
import "./globals.css";
import ChatWrapper from "../components/chat/chat-wrapper";
import NextAuthSessionProvider from "./providers/SessionProvider";
import { APP_CONFIG } from "@/lib/constants";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
};

const pixelFont = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`no-scrollbar ${pixelFont.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${spaceMono.variable} antialiased bg-black text-white font-orbitron no-scrollbar`}
      >
        <main className="w-full overflow-hidden">
          <NextAuthSessionProvider>
            {children}
            <ChatWrapper />
          </NextAuthSessionProvider>
        </main>
      </body>
    </html>
  );
}