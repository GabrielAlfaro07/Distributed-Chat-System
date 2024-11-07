// LogoutButton.tsx
import React from "react";
import { signOut } from "../../services/authService";
import { toast } from "react-toastify";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Logout failed: " + error.message);
    } else {
      toast.success("Logged out successfully");
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
