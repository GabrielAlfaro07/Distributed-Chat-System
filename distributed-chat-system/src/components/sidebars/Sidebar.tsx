// Sidebar.tsx
import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import Title from "../titles/Title";
import Searchbar from "../searchbars/Searchbar"; // Adjust path as needed

const Sidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const chats = ["Chat 1", "Chat 2", "Chat 3"]; // Sample chat names

  const filteredChats = chats.filter((chat) =>
    chat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-1/3 bg-white border-r border-gray-200 p-4">
      <Title text="Chats" />
      <Searchbar onSearch={setSearchQuery} />
      <ul>
        {filteredChats.map((chat, index) => (
          <SidebarItem key={index} name={chat} />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
