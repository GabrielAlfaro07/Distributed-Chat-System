// src/components/modals/BlockUserModal.tsx
import React from "react";

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isBlocked: boolean;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isBlocked,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold">
          {isBlocked ? "Unblock" : "Block"} User
        </h2>
        <p className="mb-4">
          Are you sure you want to {isBlocked ? "unblock" : "block"} this user?
        </p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded ${
              isBlocked ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUserModal;
