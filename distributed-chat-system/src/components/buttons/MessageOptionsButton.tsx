// MessageOptionsButton.tsx
import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";

interface MessageOptionsButtonProps {
  onEdit: () => void;
  onDelete: () => void;
}

const MessageOptionsButton: React.FC<MessageOptionsButtonProps> = ({
  onEdit,
  onDelete,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => setShowOptions((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleOptions}
        className="text-gray-500 hover:text-gray-700"
      >
        <FiInfo size={16} />
      </button>
      {showOptions && (
        <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded shadow-md z-10">
          <button
            onClick={() => {
              onEdit();
              setShowOptions(false);
            }}
            className="px-4 py-2 text-black text-left text-sm hover:bg-gray-100 w-full"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setShowOptions(false);
            }}
            className="px-4 py-2 text-left text-sm hover:bg-gray-100 w-full text-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageOptionsButton;
