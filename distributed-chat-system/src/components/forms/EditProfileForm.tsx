import React, { useState } from "react";
import Title from "../titles/Title";
import Input from "../inputs/Input";
import { UserInfo } from "../../services/authService";

interface EditProfileFormProps {
  initialUser: UserInfo;
  onSave: (updatedUser: Partial<UserInfo>) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialUser,
  onSave,
  onCancel,
}) => {
  const [username, setUsername] = useState(initialUser.username);
  const [information, setInformation] = useState(initialUser.information || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialUser.phone_number || ""
  );

  const handleSave = () => {
    onSave({ username, information, phone_number: phoneNumber });
  };

  return (
    <div>
      <div className="text-center mb-4">
        <Title text="Edit Profile" />
      </div>
      <div className="mb-4">
        <label className="text-gray-500">Username:</label>
        <Input
          label=""
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="text-gray-500">Information:</label>
        <textarea
          value={information}
          onChange={(e) => setInformation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label className="text-gray-500">Phone Number:</label>
        <Input
          label=""
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-1 border rounded text-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-1 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfileForm;
