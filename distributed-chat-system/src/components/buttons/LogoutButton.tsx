import React from "react";
import { signOut } from "../../services/authService";
import { toast } from "react-toastify";

interface LogoutButtonProps {
  onLogoutSuccess: () => void; // Callback to notify parent on successful logout
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogoutSuccess }) => {
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Logout failed: " + error.message);
    } else {
      toast.success("Logged out successfully!");
      onLogoutSuccess(); // Notify parent component to refresh the user state
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 mt-4 bg-red-500 text-white rounded"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
