import React, { useState, useEffect } from "react";
import Sidebar from "../sidebars/Sidebar";
import ChatHeader from "../headers/ChatHeader";
import ChatArea from "../chat/ChatArea";
import { deleteChatById, getChatsByUserId } from "../../services/chatService";
import { fetchUser, signOut } from "../../services/authService";

const HomeScreen: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    const getSessionUserId = async () => {
      const sessionUser = await fetchUser();
      if (sessionUser) {
        setSessionUserId(sessionUser.id_user);
      } else {
        setIsLoggedIn(false);
        setSelectedChat(null);
      }
    };
    getSessionUserId();
  }, []);

  useEffect(() => {
    if (sessionUserId) {
      loadChats();
    }
  }, [sessionUserId]);

  const updateChat = (chatId: string, lastMessage: any) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id_chat === chatId ? { ...chat, lastMessage } : chat
      )
    );
  };

  const handleLogin = async () => {
    const sessionUser = await fetchUser();
    if (sessionUser) {
      setIsLoggedIn(true);
      setSessionUserId(sessionUser.id_user);
      setSelectedChat(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setSelectedChat(null);
  };

  const loadChats = async () => {
    const chatData = await getChatsByUserId(sessionUserId);
    setChats(chatData);
  };

  const handleDeleteChat = async () => {
    if (selectedChat) {
      await deleteChatById(selectedChat.id_chat);
      setSelectedChat(null);
      loadChats();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        onSelectChat={setSelectedChat}
        onLogout={handleLogout}
        onLogin={handleLogin}
        chats={chats}
        refreshChats={loadChats}
      />

      <main className="flex-1 flex flex-col">
        <ChatHeader
          title={selectedChat?.name || "Select a Chat"}
          onDeleteChat={handleDeleteChat}
        />
        <ChatArea
          selectedChat={selectedChat}
          sessionUserId={sessionUserId}
          isLoggedIn={isLoggedIn}
          updateChat={updateChat}
        />
      </main>
    </div>
  );
};

export default HomeScreen;
