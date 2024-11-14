// ToRegisterFormButton.tsx
import React from "react";

interface ToRegisterFormButtonProps {
  onClick: () => void;
}

const ToRegisterFormButton: React.FC<ToRegisterFormButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="text-blue-600 underline mt-2 block w-full text-center"
    >
      Don't have an account? Register
    </button>
  );
};

export default ToRegisterFormButton;
