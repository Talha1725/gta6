import React from "react";

interface UpgradeOverlayProps {
  onClose: () => void;
}

const UpgradeOverlay: React.FC<UpgradeOverlayProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full text-center">
      <h2 className="text-xl font-bold mb-4">Upgrade Required</h2>
      <p className="mb-6">You have reached the limit of free AI leak generations. Please upgrade your plan to continue using this feature.</p>
      <button
        className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

export default UpgradeOverlay; 