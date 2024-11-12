import React, { useState } from "react";
import Title from "../titles/Title";
import EditProfileForm from "../forms/EditProfileForm";
import { UserInfo } from "../../services/authService";
import LogoutButton from "../buttons/LogoutButton";

interface ProfileDisplayProps {
  user: UserInfo;
  onLogoutSuccess: () => void;
  onUserUpdate: (updatedUser: Partial<UserInfo>) => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  user,
  onLogoutSuccess,
  onUserUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedData: Partial<UserInfo>) => {
    onUserUpdate(updatedData);
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      {isEditing ? (
        <EditProfileForm
          initialUser={user}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <img
            src={
              user.profile_picture_url ||
              "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <div className="text-center mb-2">
            <Title text={user.username || "User"} />
          </div>
          <p className="text-gray-500">Information:</p>
          <p className="mb-2">
            {user.information || "No information provided"}
          </p>
          <p className="text-gray-500">Phone Number:</p>
          <p className="mb-2">
            {user.phone_number || "No phone number provided"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:underline mt-2"
          >
            Edit Profile
          </button>
          <LogoutButton onLogoutSuccess={onLogoutSuccess} />
        </>
      )}
    </div>
  );
};

export default ProfileDisplay;
