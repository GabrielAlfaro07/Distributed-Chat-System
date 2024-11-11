import React, { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import Title from "../titles/Title";
import Searchbar from "../searchbars/Searchbar";
import AddChatButton from "../buttons/AddChatButton";
import { fetchUser } from "../../services/authService";
import ProfileButton from "../buttons/ProfileButton";

interface SidebarProps {
  onSelectChat: (chat: any) => void;
  onLogout: () => void;
  onLogin: () => void;
  chats: any[]; // Use chats passed from HomeScreen
  refreshChats: () => void; // Call to refresh chats when needed
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectChat,
  onLogout,
  onLogin,
  chats,
  refreshChats,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleChatSelect = (chat: any) => {
    onSelectChat(chat);
    setSelectedChatId(chat.id_chat);
  };

  useEffect(() => {
    const getSessionUserId = async () => {
      const sessionUser = await fetchUser();
      if (sessionUser?.id_user) {
        setSessionUserId(sessionUser.id_user);
      }
    };
    getSessionUserId();
  }, []);

  // Filter chats based on the search query using chat.name
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered Chats:", filteredChats); // Log filtered chats for debugging

  return (
    <aside className="w-1/3 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Title text="Chats" />
          <AddChatButton refreshChats={refreshChats} />
        </div>
        <Searchbar onSearch={setSearchQuery} />
        <ul>
          {filteredChats.map((chat) => {
            const messagePrefix =
              chat.lastMessage && chat.lastMessage.id_sender === sessionUserId
                ? "You"
                : chat.name;

            return (
              <SidebarItem
                key={chat.id_chat}
                name={chat.name}
                profilePictureUrl={chat.profile_picture_url || ""}
                lastMessage={
                  chat.lastMessage
                    ? `${messagePrefix}: ${chat.lastMessage.content}`
                    : "No messages yet"
                }
                onClick={() => handleChatSelect(chat)}
                selected={chat.id_chat === selectedChatId}
              />
            );
          })}
        </ul>
      </div>
      <div className="mt-auto">
        <ProfileButton
          refreshChats={refreshChats}
          onLogout={onLogout}
          onLogin={onLogin}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
