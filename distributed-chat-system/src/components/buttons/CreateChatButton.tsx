import React, { useEffect, useState } from "react";
import { createChat, addChatParticipant } from "../../services/chatService";
import { fetchUser } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface CreateChatButtonProps {
  selectedUsers: string[];
  onChatCreated: () => void; // Callback to reset state or show feedback on successful creation
}

const CreateChatButton: React.FC<CreateChatButtonProps> = ({
  selectedUsers,
  onChatCreated,
}) => {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch session user ID and set it
    const fetchSessionUser = async () => {
      const sessionUser = await fetchUser();
      if (sessionUser?.id_user) {
        setSessionUserId(sessionUser.id_user);
      }
    };

    fetchSessionUser();
  }, []);

  const handleCreateChat = async () => {
    if (!sessionUserId) {
      console.error("Session user ID not available");
      return;
    }

    try {
      // Get the username of the first selected user to set as chat name
      const firstUserId = selectedUsers[0];
      const firstUser = await fetchUser(firstUserId); // Pass user ID to fetch specific user

      if (!firstUser?.username) {
        throw new Error("Failed to retrieve the first user's username");
      }

      // Create a new chat with the first user's username as the chat name
      const chat = await createChat(firstUser.username);

      if (!chat || !chat.id_chat) {
        throw new Error("Failed to create chat");
      }

      // Ensure the session user ID is included in the participants
      const participants = [sessionUserId, ...selectedUsers];

      // Add each user as a chat participant
      await Promise.all(
        participants.map((userId) =>
          addChatParticipant(chat.id_chat, userId, "participant")
        )
      );

      onChatCreated(); // Reset selection or show success message
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      className="bg-blue-500 text-white rounded px-4 py-2 mt-2 w-full"
      disabled={selectedUsers.length === 0} // Disable if no users selected
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default CreateChatButton;
