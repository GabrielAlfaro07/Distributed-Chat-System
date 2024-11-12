import React, { useState, useEffect } from "react";
import { fetchUser, UserInfo } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import LoginForm from "../forms/LoginForm";
import ProfileDisplay from "../displays/ProfileDisplay";
import RegisterForm from "../forms/RegisterForm";
import { updateUser } from "../../services/userService"; // Import update function
import { toast } from "react-toastify";

interface ProfileButtonProps {
  refreshChats: () => void;
  onLogout: () => void;
  onLogin: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  refreshChats,
  onLogout,
  onLogin,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const getUser = async () => {
    const fetchedUser = await fetchUser();
    setUser(fetchedUser);
  };

  useEffect(() => {
    getUser();
  }, []);

  const toggleProfileDisplay = () => setShowProfile(!showProfile);
  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleLogoutSuccess = () => {
    setUser(null);
    refreshChats();
    setShowProfile(false);
    onLogout();
  };

  const handleLoginSuccess = () => {
    getUser();
    setShowProfile(true);
    refreshChats();
    onLogin();
  };

  const handleRegisterSuccess = () => {
    toggleForm();
    getUser();
    setShowProfile(true);
    refreshChats();
    onLogin();
  };

  const handleUserUpdate = async (updatedUser: Partial<UserInfo>) => {
    if (user) {
      try {
        // Update the database
        await updateUser(user.id_user, updatedUser);

        // Update the local state after a successful database update
        setUser({ ...user, ...updatedUser });
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div className="relative flex items-end">
      <button onClick={toggleProfileDisplay} className="text-gray-600">
        <FontAwesomeIcon icon={faUser} size="xl" />
      </button>

      {showProfile && (
        <div className="absolute left-8 mt-2 p-4 bg-white border border-gray-200 shadow-lg rounded-md z-10 w-80">
          {user ? (
            <ProfileDisplay
              user={user}
              onLogoutSuccess={handleLogoutSuccess}
              onUserUpdate={handleUserUpdate}
            />
          ) : isRegistering ? (
            <RegisterForm
              onToggleForm={toggleForm}
              onRegisterSuccess={handleRegisterSuccess}
            />
          ) : (
            <LoginForm
              onToggleForm={toggleForm}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
