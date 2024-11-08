// AddChatButton.tsx
import React, { useState } from "react";
import UserSelectionDisplay from "../displays/UserSelectionDisplay"; // Adjust the path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddChatButton: React.FC = () => {
  const [showUserSelection, setShowUserSelection] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowUserSelection((prev) => !prev)}
        className="bg-blue-500 text-white rounded px-2 py-1 mr-2"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {showUserSelection && (
        <div className="absolute mt-2 p-4 bg-white border border-gray-200 shadow-lg rounded-md z-10 w-80">
          <UserSelectionDisplay />
        </div>
      )}
    </div>
  );
};

export default AddChatButton;
