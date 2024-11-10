import React, { useState, useEffect } from "react";
import Sidebar from "../sidebars/Sidebar";
import ChatHeader from "../headers/ChatHeader";
import Message from "../messages/Message";
import MessageInput from "../inputs/MessageInput";
import { getMessagesByChatId } from "../../services/messageService";
import { fetchUser, signOut } from "../../services/authService";

const HomeScreen: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const getSessionUserId = async () => {
      const sessionUser = await fetchUser();
      if (sessionUser) {
        setSessionUserId(sessionUser.id_user);
      } else {
        setIsLoggedIn(false);
        setSelectedChat(null); // Clear selected chat on logout
        setMessages([]); // Clear messages on logout
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
    setInputMessage(""); // Clear message input when chat changes
  }, [selectedChat]);

  const handleLogin = async () => {
    const sessionUser = await fetchUser();
    if (sessionUser) {
      setIsLoggedIn(true);
      setSessionUserId(sessionUser.id_user);
      setSelectedChat(null); // Reset selected chat to refresh the view
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setSelectedChat(null);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        onSelectChat={setSelectedChat}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />

      <main className="flex-1 flex flex-col">
        <ChatHeader title={selectedChat?.name || "Select a Chat"} />

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoggedIn && selectedChat ? (
            messages.map((msg) => (
              <Message
                key={msg.id_message}
                content={msg.content}
                time={new Date(msg.created_at).toLocaleTimeString()}
                alignment={msg.id_sender === sessionUserId ? "right" : "left"}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">
              {isLoggedIn
                ? "Please select a chat to view its content"
                : "Please log in to view the content of your chats"}
            </p>
          )}
        </div>

        {/* Message Input */}
        {isLoggedIn && selectedChat && (
          <MessageInput
            chatId={selectedChat?.id_chat}
            senderId={sessionUserId}
            onMessageSent={fetchMessages}
            message={inputMessage}
            setMessage={setInputMessage}
          />
        )}
      </main>
    </div>
  );
};

export default HomeScreen;
