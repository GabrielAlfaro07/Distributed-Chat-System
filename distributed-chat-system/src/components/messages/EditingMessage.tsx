// EditingMessage.tsx
import React, { useState } from "react";

interface EditingMessageProps {
  initialContent: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

const EditingMessage: React.FC<EditingMessageProps> = ({
  initialContent,
  onSave,
  onCancel,
}) => {
  const [editedContent, setEditedContent] = useState(initialContent);

  return (
    <div className="flex flex-col pr-4">
      {/* Input Field */}
      <input
        type="text"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="p-1 border rounded w-full text-black mb-2"
      />

      {/* Buttons Container */}
      <div className="flex justify-start space-x-2">
        <button
          onClick={() => onSave(editedContent)}
          className="bg-gray-500 text-white text-sm py-1 px-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-red-500 text-white text-sm py-1 px-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditingMessage;
