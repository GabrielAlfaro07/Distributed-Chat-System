import React, { useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";
import Title from "../titles/Title";
import Searchbar from "../searchbars/Searchbar";
import AddChatButton from "../buttons/AddChatButton";
import { fetchUser } from "../../services/authService";
import { getChatsByUserId } from "../../services/chatService";
import ProfileButton from "../buttons/ProfileButton";

interface SidebarProps {
  onSelectChat: (chat: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const loadChats = async () => {
    const sessionUser = await fetchUser();
    if (sessionUser?.id_user) {
      setSessionUserId(sessionUser.id_user);
      const chatData = await getChatsByUserId(sessionUser.id_user);
      setChats(chatData);
    } else {
      setSessionUserId(null);
      setChats([]);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleChatSelect = (chat: any) => {
    const otherParticipant = chat.ChatParticipants.find(
      (participant: any) => participant.id_user !== sessionUserId
    );
    const chatName = otherParticipant?.Users?.username || "Unknown";

    // Set selected chat with the name of the other participant
    onSelectChat({ ...chat, name: chatName });
    setSelectedChatId(chat.id_chat);
  };

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
          <AddChatButton refreshChats={loadChats} />
        </div>
        <Searchbar onSearch={setSearchQuery} />
        <ul>
          {filteredChats.map((chat) => {
            const otherParticipant = chat.ChatParticipants?.find(
              (participant: any) => participant.id_user !== sessionUserId
            );
            const lastMessage = chat.Messages?.[0];
            const messagePrefix =
              lastMessage && lastMessage.id_sender === sessionUserId
                ? "You"
                : otherParticipant?.Users?.username || "Unknown";

            return (
              <SidebarItem
                key={chat.id_chat}
                name={otherParticipant.Users.username}
                profilePictureUrl={otherParticipant.Users.profile_picture_url}
                lastMessage={
                  lastMessage
                    ? `${messagePrefix}: ${lastMessage.content}`
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
        <ProfileButton refreshChats={loadChats} />
      </div>
    </aside>
  );
};

export default Sidebar;
