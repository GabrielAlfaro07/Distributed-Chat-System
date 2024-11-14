import React, { useEffect, useRef } from "react";
import Message from "../messages/Message";
import EmptyStateMessage from "../messages/EmptyStageMessage";

interface MessageListProps {
  messages: any[];
  sessionUserId: string;
  isLoggedIn: boolean;
  selectedChat: any;
  onMessageUpdated: () => void;
  searchQuery: string; // New prop for search query
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  sessionUserId,
  isLoggedIn,
  selectedChat,
  onMessageUpdated,
  searchQuery,
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the message list whenever messages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-4 overflow-y-auto h-[calc(100vh-8.1rem)]">
      {isLoggedIn && selectedChat ? (
        messages
          .filter((msg) => !msg.is_deleted)
          .map((msg) => (
            <Message
              key={msg.id_message}
              id={msg.id_message}
              content={msg.content}
              time={new Date(msg.created_at).toLocaleTimeString()}
              alignment={msg.id_sender === sessionUserId ? "right" : "left"}
              isEdited={msg.is_edited}
              onMessageUpdated={onMessageUpdated}
              id_sender={msg.id_sender}
              session_user_id={sessionUserId}
              searchQuery={searchQuery}
              fileUrl={msg.file_url}
              fileType={msg.file_type}
            />
          ))
      ) : (
        <EmptyStateMessage isLoggedIn={isLoggedIn} />
      )}
      {/* This div will act as the scroll target to ensure the latest message is always visible */}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
