import React, { useEffect, useState } from "react";
import MessageList from "../lists/MessageList";
import MessageInput from "../inputs/MessageInput";
import {
  getMessagesByChatId,
  subscribeToMessages,
  unsubscribe,
} from "../../services/messageService";

interface ChatAreaProps {
  selectedChat: any;
  sessionUserId: string;
  isLoggedIn: boolean;
  updateChat: (chatId: string, lastMessage: any) => void; // Add this prop
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

  const fetchMessages = async () => {
    if (selectedChat?.id_chat) {
      const chatMessages = await getMessagesByChatId(selectedChat.id_chat);
      setMessages(chatMessages);

      // Update the last message in the sidebar chat item
      if (chatMessages.length > 0) {
        const lastMessage = chatMessages[chatMessages.length - 1];
        updateChat(selectedChat.id_chat, lastMessage);
      }
    }
  };

  useEffect(() => {
    if (selectedChat?.id_chat) {
      fetchMessages();
      setInputMessage("");

      // Unsubscribe from the previous chat's message subscription if it exists
      if (messageSubscription) {
        unsubscribe(messageSubscription);
      }

      // Set up real-time subscription for the current chat
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

      // Cleanup function to unsubscribe when the component unmounts or `selectedChat` changes
      return () => {
        if (newMessageSubscription) {
          // Perform async unsubscribe in an immediately-invoked function
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
        onMessageUpdated={fetchMessages} // Pass fetchMessages as onMessageUpdated
      />
      {isLoggedIn && selectedChat && (
        <MessageInput
          chatId={selectedChat.id_chat}
          senderId={sessionUserId}
          onMessageSent={fetchMessages}
          message={inputMessage}
          setMessage={setInputMessage}
        />
      )}
    </div>
  );
};

export default ChatArea;
