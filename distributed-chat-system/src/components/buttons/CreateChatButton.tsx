// CreateChatButton.tsx
import React from "react";
import { createChat, addChatParticipant } from "../../services/chatService";

interface CreateChatButtonProps {
  selectedUsers: string[];
  onChatCreated: () => void; // Callback to reset state or show feedback on successful creation
}

const CreateChatButton: React.FC<CreateChatButtonProps> = ({
  selectedUsers,
  onChatCreated,
}) => {
  const handleCreateChat = async () => {
    try {
      // Create a new chat and get the chat ID
      const chat = await createChat("New Chat");

      if (!chat || !chat.id_chat) {
        throw new Error("Failed to create chat");
      }

      // Add each selected user as a chat participant
      await Promise.all(
        selectedUsers.map((userId) =>
          addChatParticipant(chat.id_chat, userId, "participant")
        )
      );
      alert("Chat created successfully!");
      onChatCreated(); // Reset selection or show success message
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      className="bg-green-500 text-white rounded px-4 py-2 mt-2 w-full"
      disabled={selectedUsers.length === 0} // Disable if no users selected
    >
      Create Chat
    </button>
  );
};

export default CreateChatButton;
