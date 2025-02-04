import React from "react";
import { signIn } from "../../services/authService";
import { toast } from "react-toastify";

interface LoginButtonProps {
  email: string;
  password: string;
  onLoginSuccess: () => void; // Callback to notify parent on successful login
}

const LoginButton: React.FC<LoginButtonProps> = ({
  email,
  password,
  onLoginSuccess,
}) => {
  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      toast.error("Login failed: " + error.message);
    } else {
      toast.success("Logged in successfully!");
      onLoginSuccess(); // Notify parent component to refresh the user state
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded"
    >
      Log In
    </button>
  );
};

export default LoginButton;
