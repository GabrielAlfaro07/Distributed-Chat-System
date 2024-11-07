// ToLoginFormButton.tsx
import React from "react";

interface ToLoginFormButtonProps {
  onClick: () => void;
}

const ToLoginFormButton: React.FC<ToLoginFormButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-blue-600 underline mt-2 block w-full text-center"
    >
      Already have an account? Log in
    </button>
  );
};

export default ToLoginFormButton;
