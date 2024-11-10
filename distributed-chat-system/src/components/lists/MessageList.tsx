import React from "react";
import Message from "../messages/Message";
import EmptyStateMessage from "../messages/EmptyStageMessage";

interface MessageListProps {
  messages: any[];
  sessionUserId: string;
  isLoggedIn: boolean;
  selectedChat: any;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  sessionUserId,
  isLoggedIn,
  selectedChat,
}) => (
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
      <EmptyStateMessage isLoggedIn={isLoggedIn} />
    )}
  </div>
);

export default MessageList;
