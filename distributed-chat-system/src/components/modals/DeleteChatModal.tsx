// DeleteChatModal.tsx
import React from "react";

interface DeleteChatModalProps {
  chatName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  chatName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Delete Chat</h2>
        <p>Are you sure you want to delete the chat with {chatName}?</p>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
