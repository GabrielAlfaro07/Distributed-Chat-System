import React, { useState, useEffect } from "react";
import { createChat, addChatParticipant } from "../../services/chatService";
import { fetchUser } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface CreateChatButtonProps {
  selectedUsers: string[];
  onChatCreated: () => void;
}

const CreateChatButton: React.FC<CreateChatButtonProps> = ({
  selectedUsers,
  onChatCreated,
}) => {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
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
      const chat = await createChat(sessionUserId);
      if (!chat || !chat.id_chat) throw new Error("Failed to create chat");

      const participants = [sessionUserId, ...selectedUsers];
      await Promise.all(
        participants.map((userId) =>
          addChatParticipant(chat.id_chat, userId, "participant")
        )
      );

      onChatCreated();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      className="bg-blue-500 text-white rounded px-4 py-2 mt-2 w-full"
      disabled={selectedUsers.length === 0}
    >
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default CreateChatButton;
