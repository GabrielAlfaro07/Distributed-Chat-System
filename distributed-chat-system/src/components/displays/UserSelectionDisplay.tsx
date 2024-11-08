import React, { useState } from "react";
import UserSelectionList from "../lists/UserSelectionList";
import CreateChatButton from "../buttons/CreateChatButton";
import Title from "../titles/Title";

interface UserSelectionDisplayProps {
  refreshChats: () => void;
}

const UserSelectionDisplay: React.FC<UserSelectionDisplayProps> = ({
  refreshChats,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const resetSelection = () => {
    setSelectedUsers([]);
  };

  return (
    <div>
      <div className="mb-4">
        <Title text="Create chat with:" />
      </div>
      <div className="max-h-60 overflow-y-auto">
        <UserSelectionList
          selectedUsers={selectedUsers}
          onUserToggle={handleUserToggle}
        />
        <CreateChatButton
          selectedUsers={selectedUsers}
          onChatCreated={() => {
            resetSelection();
            refreshChats(); // Refresh chat list after creating a chat
          }}
        />
      </div>
    </div>
  );
};

export default UserSelectionDisplay;
