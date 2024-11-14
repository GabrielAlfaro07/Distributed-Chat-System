import React, { useState } from "react";
import UserSelectionDisplay from "../displays/UserSelectionDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface AddChatButtonProps {
  refreshChats: () => void;
}

const AddChatButton: React.FC<AddChatButtonProps> = ({ refreshChats }) => {
  const [showUserSelection, setShowUserSelection] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowUserSelection((prev) => !prev)}
        className="bg-blue-500 text-white rounded px-2 py-1"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {showUserSelection && (
        <div className="absolute mt-2 p-4 bg-gray-800 border border-gray-600 shadow-lg rounded-md z-10 w-80">
          <UserSelectionDisplay refreshChats={refreshChats} />
        </div>
      )}
    </div>
  );
};

export default AddChatButton;
