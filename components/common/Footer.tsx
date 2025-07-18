import React from 'react';

const SimpleFooter: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-8 px-4 text-xs text-gray-400 font-mono">
      <div className="max-w-3xl mx-auto space-y-4">
        <p className="text-center text-xs text-gray-500">
          GTA6Preorder.com is a satirical fan experiment protected by the <strong>First Amendment</strong> and the <strong>Lanham Act's parody clause</strong>. Not affiliated with Rockstar Games or Take‑Two Interactive. All marks used under <em>nominative fair use</em>.
        </p>
        <p className="text-center text-sm text-pink-400 flex items-center justify-center gap-2">
          {/* Rotating light icon */}
          <svg className="w-4 h-4 animate-pulse text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="#fde047" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>
            This is NOT the official GTA 6 site — but it might be better. Parody protected. Merch legendary.
          </span>
        </p>
        <div className="mt-6">
          <h2 className="text-lg font-bold text-cyan-400 mb-2 text-center">Legal Notice</h2>
          <div className="space-y-2">
            <p className="text-center">This website is a legally protected parody, satire, and artistic expression not affiliated with Rockstar Games or Take‑Two Interactive.</p>
            <p className="text-center">Under the <strong>Lanham Act (15 U.S.C. § 1125)</strong> and <strong>Rogers v. Grimaldi (875 F.2d 994)</strong>, parody is a recognized and protected form of expression. This project does not imply endorsement or association with Rockstar Games, nor does it offer any official products or preorders for Grand Theft Auto VI.</p>
            <p className="text-center">All purchases from this site relate solely to satirical digital art, fan merchandise, or NFTs created for parody and commentary — not official Rockstar content.</p>
            <p className="text-center">If you're a legal representative of Rockstar or Take-Two, please note: no consumer is misled, and all trademark use is nominative and transformative. This site is monitored by First Amendment legal counsel and media watchdog agencies.</p>
          </div>
        </div>
        <p className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
          {/* Octagonal stop sign icon */}
          <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" stroke="currentColor" strokeWidth="2" fill="#f472b6"/>
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">!</text>
          </svg>
          <span>
            By checking out, you acknowledge this is a fan-made parody and not affiliated with Rockstar Games or Take‑Two Interactive. You're buying satire — not software.
          </span>
        </p>
      </div>
    </footer>
  );
};

export default SimpleFooter;