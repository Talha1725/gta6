import React from "react";
import CollectionRow from "./CollectionRow";

interface Collection {
  id: string;
  name: string;
  logo: string;
  floorPrice: string;
  volume: string;
  verified: boolean;
}

interface CollectionTableProps {
  collections: Collection[];
}

const CollectionTable: React.FC<CollectionTableProps> = ({ collections }) => {
  // Split collections into left and right sides
  const midPoint = Math.ceil(collections.length / 2);
  const leftSideCollections = collections.slice(0, midPoint);
  const rightSideCollections = collections.slice(midPoint);

  // Reusable table header component
  const TableHeader = () => (
    <thead className="bg-[#2A1E35]">
      <tr>
        <th className="py-3 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider text-center w-12">
          Rank
        </th>
        <th className="py-3 px-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
          Collection
        </th>
        <th className="py-3 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
          Floor Price
        </th>
        <th className="py-3 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
          Volume
        </th>
      </tr>
    </thead>
  );

  // Reusable table component
  const Table = ({ collections: tableCollections, startRank }: { collections: Collection[]; startRank: number }) => (
    <div className="flex-1 overflow-x-auto">
      <table className="min-w-full bg-transparent rounded-lg overflow-hidden">
        <TableHeader />
        <tbody>
          {tableCollections.map((collection, index) => (
            <CollectionRow
              key={collection.id}
              rank={startRank + index}
              id={collection.id}
              name={collection.name}
              logo={collection.logo}
              floorPrice={collection.floorPrice}
              volume={collection.volume}
              verified={collection.verified}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row md:gap-6">
      <Table collections={leftSideCollections} startRank={1} />
      <div className="mb-4 md:mb-0" /> {/* Spacer for mobile */}
      <Table collections={rightSideCollections} startRank={midPoint + 1} />
    </div>
  );
};

export default CollectionTable;