import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface SendButtonProps {
  onClick: () => void;
  isDisabled: boolean; // New prop to handle blocking
}

const SendButton: React.FC<SendButtonProps> = ({ onClick, isDisabled }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded flex items-center justify-center ${
        isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
      }`}
      disabled={isDisabled}
    >
      <FontAwesomeIcon icon={faPaperPlane} />
    </button>
  );
};

export default SendButton;
