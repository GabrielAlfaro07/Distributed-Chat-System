// ProfileButton.tsx
import React, { useState, useEffect } from "react";
import { fetchUser } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import LoginForm from "../forms/LoginForm";
import ProfileDisplay from "../displays/ProfileDisplay";

const ProfileButton: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser();
      setUser(user);
    };

    getUser();
  }, []);

  const toggleProfileDisplay = () => setShowProfile(!showProfile);

  return (
    <div className="relative">
      {/* Profile Button */}
      <button onClick={toggleProfileDisplay} className="text-gray-600">
        <FontAwesomeIcon icon={faUser} size="2x" />
      </button>

      {/* Floating Profile/Log In Display */}
      {showProfile && (
        <div className="absolute right-0 mt-2 p-4 bg-white border border-gray-200 shadow-lg rounded-md z-10 w-64">
          {user ? <ProfileDisplay user={user} /> : <LoginForm />}
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
