import React, { useEffect, useState } from "react";
import MessageList from "../lists/MessageList";
import MessageInput from "../inputs/MessageInput";
import {
  getMessagesByChatId,
  subscribeToMessages,
  unsubscribe,
} from "../../services/messageService";
import { isUserBlocked } from "../../services/blockedUserService"; // Import blocked check

interface ChatAreaProps {
  selectedChat: any;
  sessionUserId: string;
  isLoggedIn: boolean;
  updateChat: (chatId: string, lastMessage: any) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedChat,
  sessionUserId,
  isLoggedIn,
  updateChat,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [messageSubscription, setMessageSubscription] = useState<any>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(false); // New state for blocked status

  const fetchMessages = async () => {
    if (selectedChat?.id_chat) {
      const chatMessages = await getMessagesByChatId(selectedChat.id_chat);
      setMessages(chatMessages);
      const lastMessage = chatMessages.filter((msg) => !msg.is_deleted).pop();
      updateChat(selectedChat.id_chat, lastMessage || null);
    }
  };

  useEffect(() => {
    const checkBlockedStatus = async () => {
      if (selectedChat && sessionUserId) {
        const otherUserId = selectedChat.ChatParticipants.find(
          (participant) => participant.id_user !== sessionUserId
        )?.id_user;

        if (otherUserId) {
          const isBlocked = await isUserBlocked(sessionUserId, otherUserId);
          setIsBlocked(isBlocked);
        }
      }
    };

    checkBlockedStatus();
  }, [selectedChat, sessionUserId]);

  useEffect(() => {
    if (selectedChat?.id_chat) {
      fetchMessages();
      setInputMessage("");

      if (messageSubscription) {
        unsubscribe(messageSubscription);
      }

      const newMessageSubscription = subscribeToMessages(
        selectedChat.id_chat,
        (newMessage) => {
          if (newMessage.chat_id === selectedChat.id_chat) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            updateChat(selectedChat.id_chat, newMessage);
          }
        }
      );

      setMessageSubscription(newMessageSubscription);

      return () => {
        if (newMessageSubscription) {
          (async () => {
            await unsubscribe(newMessageSubscription);
          })();
        }
      };
    }
  }, [selectedChat]);

  return (
    <div className="flex-1 flex flex-col">
      <MessageList
        messages={messages}
        sessionUserId={sessionUserId}
        isLoggedIn={isLoggedIn}
        selectedChat={selectedChat}
        onMessageUpdated={fetchMessages}
      />
      {isLoggedIn && selectedChat && (
        <MessageInput
          chatId={selectedChat.id_chat}
          senderId={sessionUserId}
          onMessageSent={fetchMessages}
          message={inputMessage}
          setMessage={setInputMessage}
          isBlocked={isBlocked} // Pass blocked status to MessageInput
        />
      )}
    </div>
  );
};

export default ChatArea;
