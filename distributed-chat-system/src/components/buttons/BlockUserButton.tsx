// src/components/buttons/BlockUserButton.tsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addBlockedUser,
  removeBlockedUser,
  isUserBlocked,
} from "../../services/blockedUserService";
import BlockUserModal from "../modals/BlockUserModal";

interface BlockUserButtonProps {
  sessionUserId: string;
  otherParticipantId: string;
}

const BlockUserButton: React.FC<BlockUserButtonProps> = ({
  sessionUserId,
  otherParticipantId,
}) => {
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkBlockedStatus = async () => {
      const blocked = await isUserBlocked(sessionUserId, otherParticipantId);
      setIsBlocked(blocked);
    };
    checkBlockedStatus();
  }, [sessionUserId, otherParticipantId]);

  const toggleBlockUser = async () => {
    try {
      if (isBlocked) {
        await removeBlockedUser(sessionUserId, otherParticipantId);
        toast.success("User unblocked successfully.");
      } else {
        await addBlockedUser(sessionUserId, otherParticipantId);
        toast.success("User blocked successfully.");
      }
      setIsBlocked(!isBlocked);
    } catch (error) {
      console.error("Error updating block status:", error);
      toast.error("Failed to update block status.");
    } finally {
      setIsModalOpen(false); // Close modal after action
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${
          isBlocked ? "bg-green-500" : "bg-red-500"
        } text-white p-2 rounded flex items-center justify-center`}
      >
        <FontAwesomeIcon icon={isBlocked ? faUnlockAlt : faBan} />
      </button>

      <BlockUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={toggleBlockUser}
        isBlocked={isBlocked}
      />
    </>
  );
};

export default BlockUserButton;
