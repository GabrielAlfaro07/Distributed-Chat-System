import React, { useState, useEffect } from "react";
import { fetchUser } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import LoginForm from "../forms/LoginForm";
import ProfileDisplay from "../displays/ProfileDisplay";
import RegisterForm from "../forms/RegisterForm"; // Import RegisterForm
import { signOut } from "../../services/authService"; // Import signOut function

interface ProfileButtonProps {
  refreshChats: () => void; // Add refreshChats prop to trigger chat refresh
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ refreshChats }) => {
  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Manage the toggle state

  // Fetch user on component mount or after actions like login/logout
  const getUser = async () => {
    const fetchedUser = await fetchUser();
    setUser(fetchedUser);
  };

  useEffect(() => {
    getUser();
  }, []);

  // Handle toggling the profile display
  const toggleProfileDisplay = () => setShowProfile(!showProfile);

  // Handle form toggle (login/register)
  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleLogoutSuccess = () => {
    setUser(null); // Clear user state after logout
    getUser(); // Refresh user data (should be null after logout)
    setShowProfile(false);
    refreshChats(); // Refresh chats after logout
  };

  const handleLoginSuccess = () => {
    getUser(); // Refresh user data after login
    setShowProfile(true); // Automatically show the profile after login
    refreshChats(); // Refresh chats after login
  };

  const handleRegisterSuccess = () => {
    toggleForm();
    getUser(); // Refresh user data after registration
    setShowProfile(true); // Automatically show the profile after registration
    refreshChats(); // Refresh chats after registration
  };

  return (
    <div className="relative flex items-end">
      {/* Profile Button */}
      <button onClick={toggleProfileDisplay} className="text-gray-600">
        <FontAwesomeIcon icon={faUser} size="xl" />
      </button>

      {/* Floating Profile/Log In Display */}
      {showProfile && (
        <div className="absolute left-8 mt-2 p-4 bg-white border border-gray-200 shadow-lg rounded-md z-10 w-80">
          {user ? (
            <ProfileDisplay user={user} onLogoutSuccess={handleLogoutSuccess} />
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
