import React from "react";
import Message from "../messages/Message";
import EmptyStateMessage from "../messages/EmptyStageMessage";

interface MessageListProps {
  messages: any[];
  sessionUserId: string;
  isLoggedIn: boolean;
  selectedChat: any;
  onMessageUpdated: () => void;
  searchQuery; // New prop for search query
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  sessionUserId,
  isLoggedIn,
  selectedChat,
  onMessageUpdated,
  searchQuery,
}) => (
  <div className="p-4 overflow-y-auto max-h-[calc(100vh-8.1rem)]">
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
            searchQuery={searchQuery} // Pass search query to each message
          />
        ))
    ) : (
      <EmptyStateMessage isLoggedIn={isLoggedIn} />
    )}
  </div>
);

export default MessageList;
