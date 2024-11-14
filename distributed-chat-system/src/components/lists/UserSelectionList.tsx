import React, { useEffect, useState } from "react";
import { getAllUsersExceptSessionUser } from "../../services/userService";
import { fetchUser, UserInfo } from "../../services/authService";

interface UserSelectionListProps {
  selectedUsers: string[];
  onUserToggle: (userId: string) => void;
}

const UserSelectionList: React.FC<UserSelectionListProps> = ({
  selectedUsers,
  onUserToggle,
}) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeUsers = async () => {
      const sessionUser = await fetchUser();
      if (sessionUser?.id_user) {
        setSessionUserId(sessionUser.id_user);
        const usersData = await getAllUsersExceptSessionUser(
          sessionUser.id_user
        );
        setUsers(usersData);
      }
    };

    initializeUsers();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md max-h-60 overflow-y-auto">
      {users.map((user) => (
        <div key={user.id_user} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id_user)}
            onChange={() => onUserToggle(user.id_user)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">{user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default UserSelectionList;
