import React from "react";
import { signUp, UserInfo } from "../../services/authService";
import { toast } from "react-toastify";

interface RegisterButtonProps {
  email: string;
  password: string;
  userInfo: UserInfo;
  onRegisterSuccess: () => void; // Callback to notify parent on successful registration
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  email,
  password,
  userInfo,
  onRegisterSuccess,
}) => {
  const handleRegister = async () => {
    const { error } = await signUp(email, password, userInfo);
    if (error) {
      toast.error("Registration failed: " + error.message);
    } else {
      toast.success("Registered successfully!");
      onRegisterSuccess(); // Notify parent component to refresh the user state
    }
  };

  return (
    <button
      onClick={handleRegister}
      className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded"
    >
      Register
    </button>
  );
};

export default RegisterButton;
