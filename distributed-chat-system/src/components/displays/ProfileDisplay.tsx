// ProfileDisplay.tsx
import React from "react";
import LogoutButton from "../buttons/LogoutButton";
import { UserInfo } from "../../services/authService"; // Import the UserInfo interface

interface ProfileDisplayProps {
  user: UserInfo;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user }) => {
  const profilePictureUrl =
    user.profile_picture_url ||
    "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png";

  return (
    <div className="p-4 border rounded shadow-md text-center">
      <img
        src={profilePictureUrl}
        alt="Profile"
        className="w-20 h-20 rounded-full mx-auto mb-4"
      />
      <h2 className="text-lg font-semibold">{user.username || "User"}</h2>
      <p>{user.information || "No information provided"}</p>
      <p>{user.phone_number || "No phone number provided"}</p>
      <LogoutButton />
    </div>
  );
};

export default ProfileDisplay;
