// MessageList.tsx
import React from "react";
import Message from "../messages/Message";
import EmptyStateMessage from "../messages/EmptyStageMessage";

interface MessageListProps {
  messages: any[];
  sessionUserId: string;
  isLoggedIn: boolean;
  selectedChat: any;
  onMessageUpdated: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  sessionUserId,
  isLoggedIn,
  selectedChat,
  onMessageUpdated,
}) => (
  <div className="flex-1 p-4 overflow-y-auto">
    {isLoggedIn && selectedChat ? (
      messages
        .filter((msg) => !msg.is_deleted) // Filter out deleted messages
        .map((msg) => (
          <Message
            key={msg.id_message}
            id={msg.id_message}
            content={msg.content}
            time={new Date(msg.created_at).toLocaleTimeString()}
            alignment={msg.id_sender === sessionUserId ? "right" : "left"}
            isEdited={msg.is_edited}
            onMessageUpdated={onMessageUpdated} // Refresh messages when a message is updated or deleted
            id_sender={msg.id_sender}
            session_user_id={sessionUserId}
          />
        ))
    ) : (
      <EmptyStateMessage isLoggedIn={isLoggedIn} />
    )}
  </div>
);

export default MessageList;
