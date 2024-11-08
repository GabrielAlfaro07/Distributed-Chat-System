// UserSelectionDisplay.tsx
import React, { useState } from "react";
import UserSelectionList from "../lists/UserSelectionList";
import CreateChatButton from "../buttons/CreateChatButton"; // Adjust path as needed

const UserSelectionDisplay: React.FC = () => {
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
      <div className="max-h-60 overflow-y-auto">
        <UserSelectionList
          selectedUsers={selectedUsers}
          onUserToggle={handleUserToggle}
        />
        <CreateChatButton
          selectedUsers={selectedUsers}
          onChatCreated={resetSelection}
        />
      </div>
    </div>
  );
};

export default UserSelectionDisplay;
