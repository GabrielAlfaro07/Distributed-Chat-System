import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

interface AddDocumentButtonProps {
  onFileSelect: (file: File) => void; // Callback to pass the selected file to the parent
}

const AddDocumentButton: React.FC<AddDocumentButtonProps> = ({
  onFileSelect,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file); // Pass the selected file to the parent
    }
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className="p-2 rounded bg-blue-500 text-white flex items-center justify-center cursor-pointer"
      >
        <FontAwesomeIcon icon={faPaperclip} />
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AddDocumentButton;
