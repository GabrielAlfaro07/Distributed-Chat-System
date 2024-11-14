import React from "react";

const SenderName: React.FC<{ name: string | null }> = ({ name }) => (
  <div className="text-sm font-semibold text-gray-700 mb-1">
    {name || "Unknown User"}
  </div>
);

export default SenderName;
