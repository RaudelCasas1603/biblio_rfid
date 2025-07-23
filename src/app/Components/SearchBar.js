import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="flex items-center w-full max-w-3xl mx-auto border border-gray-300 rounded-full px-4 py-2 shadow-md bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
      <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-3" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Buscar libros por título, autor o categoría..."
        className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
      <button
        onClick={() => onSearch(searchTerm)}
        className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full transition">
        Buscar
      </button>
    </div>
  );
}
