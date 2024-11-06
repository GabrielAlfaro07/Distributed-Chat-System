// SidebarItem.tsx
import React from "react";

interface SidebarItemProps {
  name: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name }) => {
  return (
    <li className="p-2 hover:bg-gray-200 cursor-pointer rounded">{name}</li>
  );
};

export default SidebarItem;
