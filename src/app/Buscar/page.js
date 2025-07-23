"use client";

import { useState } from "react";
import SearchBar from "../Components/SearchBar";
import Card from "../Components/BookCard";
import Books from "../data/books";

export default function Buscar() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = Books.filter((book) => {
    const term = searchTerm.toLowerCase();
    return (
      book.titulo.toLowerCase().includes(term) ||
      book.autor.toLowerCase().includes(term) ||
      book.categoria.toLowerCase().includes(term)
    );
  });

  return (
    <div className="px-4">
      <h1 className="text-5xl font-bold text-center mt-8">Buscar</h1>

      <div className="flex justify-center items-center mt-10">
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Card
              key={book.id}
              id={book.id}
              titulo={book.titulo}
              autor={book.autor}
              imagen={book.imagen}
              genero={book.genero}
              categoria={book.categoria}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-8">
            No se encontraron libros con ese término.
          </p>
        )}
      </div>
    </div>
  );
}
