import React, { useState, useEffect } from "react";
import Sidebar from "../sidebars/Sidebar";
import ChatHeader from "../headers/ChatHeader";
import ChatArea from "../chat/ChatArea";
import { deleteChatById, getChatsByUserId } from "../../services/chatService";
import { fetchUser, signOut } from "../../services/authService";
import { getBlockedUsers } from "../../services/blockedUserService"; // Import blocked user service
import {
  subscribeToChats,
  unsubscribe as unsubscribeChat,
} from "../../services/chatService";

const HomeScreen: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]); // New state for blocked users
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSubscription, setChatSubscription] = useState<any>(null);

  useEffect(() => {
    const getSessionUserId = async () => {
      const sessionUser = await fetchUser();
      console.log("Session User:", sessionUser); // Log session user
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
    if (sessionUserId && isLoggedIn) {
      console.log("Loading chats for user:", sessionUserId);
      loadChats();
      loadBlockedUsers(); // Fetch blocked users when session user ID is available
      handleChatSubscription(); // Set up the chat subscription
    }
    // Clean up chat subscription on unmount
    return () => {
      if (chatSubscription) unsubscribeChat(chatSubscription);
    };
  }, [sessionUserId, isLoggedIn]);

  const handleChatSubscription = () => {
    if (chatSubscription) unsubscribeChat(chatSubscription); // Clear existing subscription if present

    const newChatSubscription = subscribeToChats(sessionUserId, () => {
      loadChats(); // Reload chats when an insert or delete occurs
    });
    setChatSubscription(newChatSubscription);
  };

  const loadBlockedUsers = async () => {
    try {
      const blocked = await getBlockedUsers(sessionUserId);
      setBlockedUsers(blocked);
    } catch (error) {
      console.error("Error loading blocked users:", error);
    }
  };

  const updateChat = (chatId: string, lastMessage: any) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id_chat === chatId ? { ...chat, lastMessage } : chat
      )
    );
  };

  const handleLogin = async () => {
    const sessionUser = await fetchUser();
    console.log("Session User on Login:", sessionUser); // Log session user during login
    if (sessionUser) {
      setIsLoggedIn(true);
      setSelectedChat(null);
      setSessionUserId(sessionUser.id_user);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsLoggedIn(false);
    setSessionUserId(""); // Clear session user ID
    setSelectedChat(null); // Deselect any selected chat
    setChats([]); // Clear the chats in the sidebar
  };

  const loadChats = async () => {
    if (!sessionUserId) {
      console.log("No session user ID found, skipping chat load.");
      return;
    }

    console.log("Loading chats for user:", sessionUserId);
    try {
      const chatData = await getChatsByUserId(sessionUserId);
      console.log("Fetched Chat Data:", chatData);

      const updatedChats = chatData.map((chat) => {
        const otherParticipant = chat.ChatParticipants.find(
          (participant) => participant.id_user !== sessionUserId
        );

        // Safely access Users[0] if it exists
        const otherParticipantId = otherParticipant?.id_user || null;
        const otherParticipantName =
          otherParticipant?.Users?.username || "Unknown";
        const otherParticipantProfilePicture =
          otherParticipant?.Users?.[0]?.profile_picture_url || "";

        console.log("Other Participant:", otherParticipant);
        console.log("Other Participant Name:", otherParticipantName);

        return {
          ...chat,
          name: otherParticipantName,
          profilePictureUrl: otherParticipantProfilePicture,
          otherParticipantId,
        };
      });

      setChats(updatedChats);
      console.log("Updated Chats:", updatedChats);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const handleDeleteChat = async () => {
    if (selectedChat) {
      console.log("Deleting chat:", selectedChat.id_chat); // Log chat deletion
      await deleteChatById(selectedChat.id_chat);
      setSelectedChat(null);
      loadChats();
    }
  };

  return (
    <div className="flex h-screen bg-gray-700">
      <Sidebar
        onSelectChat={setSelectedChat}
        onLogout={handleLogout}
        onLogin={handleLogin}
        chats={chats}
        refreshChats={loadChats}
      />

      <main className="flex-1 flex flex-col">
        <ChatHeader
          title={selectedChat?.name || "Select a chat"}
          onDeleteChat={handleDeleteChat}
          sessionUserId={sessionUserId}
          otherParticipantId={selectedChat?.otherParticipantId}
          onSearch={setSearchQuery}
        />
        <ChatArea
          selectedChat={selectedChat}
          sessionUserId={sessionUserId}
          isLoggedIn={isLoggedIn}
          updateChat={updateChat}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default HomeScreen;
