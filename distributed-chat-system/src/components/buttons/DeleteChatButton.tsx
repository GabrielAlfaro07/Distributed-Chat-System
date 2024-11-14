// DeleteChatButton.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeleteChatButtonProps {
  onClick: () => void;
}

const DeleteChatButton: React.FC<DeleteChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white p-2 rounded flex items-center justify-center"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
};

export default DeleteChatButton;
