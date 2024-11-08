import React, { useState, useEffect } from "react";
import Sidebar from "../sidebars/Sidebar";
import ChatHeader from "../headers/ChatHeader";
import Message from "../messages/Message";
import MessageInput from "../inputs/MessageInput";
import { getMessagesByChatId } from "../../services/messageService";
import { fetchUser } from "../../services/authService";

const HomeScreen: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string>("");

  useEffect(() => {
    const getSessionUserId = async () => {
      const sessionUser = await fetchUser();
      if (sessionUser) {
        setSessionUserId(sessionUser.id_user);
      }
    };
    getSessionUserId();
  }, []);

  const fetchMessages = async () => {
    if (selectedChat?.id_chat) {
      const chatMessages = await getMessagesByChatId(selectedChat.id_chat);
      setMessages(chatMessages);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSelectChat={setSelectedChat} />

      <main className="flex-1 flex flex-col">
        <ChatHeader title={selectedChat?.name || "Select a chat"} />

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <Message
              key={msg.id_message}
              content={msg.content}
              time={new Date(msg.created_at).toLocaleTimeString()}
              alignment={msg.id_sender === sessionUserId ? "right" : "left"}
            />
          ))}
        </div>

        <MessageInput
          chatId={selectedChat?.id_chat}
          senderId={sessionUserId}
          onMessageSent={fetchMessages}
        />
      </main>
    </div>
  );
};

export default HomeScreen;
