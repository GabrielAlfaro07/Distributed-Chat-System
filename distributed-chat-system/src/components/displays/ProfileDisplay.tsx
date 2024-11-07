// ProfileDisplay.tsx
import React from "react";
import LogoutButton from "../buttons/LogoutButton";
import { UserInfo } from "../../services/authService"; // Import the UserInfo interface
import Title from "../titles/Title";

interface ProfileDisplayProps {
  user: UserInfo;
  onLogoutSuccess: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  user,
  onLogoutSuccess,
}) => {
  const profilePictureUrl =
    user.profile_picture_url ||
    "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png";

  return (
    <div className="p-4">
      <img
        src={profilePictureUrl}
        alt="Profile"
        className="w-32 h-32 rounded-full mx-auto mb-4"
      />
      <div className="text-center mb-2">
        <Title text={user.username || "User"} />
      </div>
      <p className="text-gray-500">Information: </p>
      <p className="mb-2">{user.information || "No information provided"}</p>
      <p className="text-gray-500">Phone Number: </p>
      <p>{user.phone_number || "No phone number provided"}</p>
      <LogoutButton onLogoutSuccess={onLogoutSuccess} />
    </div>
  );
};

export default ProfileDisplay;
