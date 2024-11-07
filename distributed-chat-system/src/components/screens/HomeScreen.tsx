// HomeScreen.tsx
import React from "react";
import Sidebar from "../sidebars/Sidebar";
import ChatHeader from "../headers/ChatHeader"; // Import the new ChatHeader component
import Message from "../messages/Message";
import MessageInput from "../inputs/MessageInput";

const HomeScreen: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Chat Header */}
        <ChatHeader title="Chat Name" />

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Message
            content="Hello! How are you?"
            time="10:00 AM"
            alignment="left"
          />
          <Message
            content="I’m good, thank you!"
            time="10:01 AM"
            alignment="right"
          />
        </div>

        {/* Message Input */}
        <MessageInput />
      </main>
    </div>
  );
};

export default HomeScreen;
