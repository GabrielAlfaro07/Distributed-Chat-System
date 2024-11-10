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
    const otherParticipant = chat.ChatParticipants.find(
      (participant: any) => participant.id_user !== sessionUserId
    );
    const chatName = otherParticipant?.Users?.username || "Unknown";

    onSelectChat({ ...chat, name: chatName });
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

  const filteredChats = chats.filter((chat) => {
    const otherParticipant = chat.ChatParticipants?.find(
      (participant: any) => participant.id_user !== sessionUserId
    );
    return (
      otherParticipant?.Users?.username &&
      otherParticipant.Users.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

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
            const otherParticipant = chat.ChatParticipants?.find(
              (participant: any) => participant.id_user !== sessionUserId
            );
            const messagePrefix =
              chat.lastMessage && chat.lastMessage.id_sender === sessionUserId
                ? "You"
                : otherParticipant?.Users?.username || "Unknown";

            return (
              <SidebarItem
                key={chat.id_chat}
                name={otherParticipant.Users.username}
                profilePictureUrl={otherParticipant.Users.profile_picture_url}
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
