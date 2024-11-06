// Searchbar.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchbarProps {
  onSearch: (query: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Pass search text to parent
  };

  return (
    <div className="flex items-center mb-4 p-2 border border-gray-300 rounded">
      <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search chats..."
        className="w-full outline-none"
      />
    </div>
  );
};

export default Searchbar;
