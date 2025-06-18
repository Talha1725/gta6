import React from "react";

interface PriceInfoProps {
  label: string;
  value: string;
  timeframe?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
}

const PriceInfo: React.FC<PriceInfoProps> = ({
  label,
  value,
  timeframe,
  change,
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400 font-spaceMono">
        {label}{" "}
        {timeframe && <span className="text-gray-500">({timeframe})</span>}
      </span>
      <div className="flex items-center">
        <span className="text-white font-bold font-spaceMono">{value}</span>
        {change && (
          <span
            className={`ml-2 text-xs ${
              change.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {change.isPositive ? "↑" : "↓"} {change.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceInfo;
