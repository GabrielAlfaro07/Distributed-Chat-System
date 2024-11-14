import React, { useState } from "react";
import EditProfileForm from "../forms/EditProfileForm";
import { UserInfo } from "../../services/authService";
import { updateUser } from "../../services/userService";

interface EditProfileButtonProps {
  user: UserInfo;
  onUpdate: (updatedUser: Partial<UserInfo>) => void;
}

const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  user,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedData: Partial<UserInfo>) => {
    try {
      await updateUser(user.id_user, updatedData);
      onUpdate(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="mt-4">
      {isEditing ? (
        <EditProfileForm
          initialUser={user}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:underline"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default EditProfileButton;
