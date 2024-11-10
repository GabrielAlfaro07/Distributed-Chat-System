import React from "react";

interface EmptyStateMessageProps {
  isLoggedIn: boolean;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  isLoggedIn,
}) => (
  <p className="text-gray-500 text-center">
    {isLoggedIn
      ? "Please select a chat to view its content"
      : "Please log in to view the content of your chats"}
  </p>
);

export default EmptyStateMessage;
