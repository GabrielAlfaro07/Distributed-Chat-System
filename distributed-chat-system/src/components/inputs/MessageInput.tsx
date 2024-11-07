// MessageInput.tsx
import React from "react";
import TextAreaInput from "./TextAreaInput";
import SendButton from "../buttons/SendButton";

const MessageInput: React.FC = () => {
  const handleSend = () => {
    // Define the action for sending a message
    console.log("Message sent");
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex items-center">
      <TextAreaInput
        placeholder="Type a message..."
        className="flex-grow mr-2 "
      />
      <SendButton onClick={handleSend} />
    </div>
  );
};

export default MessageInput;
