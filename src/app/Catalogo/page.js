"use client";

import { useState } from "react";
import Card from "../Components/BookCard";
import GenreCard from "../Components/GenreCard";
import SearchBar from "../Components/SearchBar";
import ChatPopup from "../Components/ChatPopup";

export default function Biblioteca({ books_list, gnres_list }) {
  const [books] = useState(books_list);
  const [genres_] = useState(gnres_list);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Genre + search filter
  const librosFiltrados = books.filter((book) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      book.titulo.toLowerCase().includes(term) ||
      book.autor.toLowerCase().includes(term) ||
      (Array.isArray(book.genero)
        ? book.genero.join(" ").toLowerCase().includes(term)
        : String(book.genero).toLowerCase().includes(term));

    const matchesGenre = categoriaSeleccionada
      ? Array.isArray(book.genero)
        ? book.genero.includes(categoriaSeleccionada)
        : book.genero === categoriaSeleccionada
      : true;

    return matchesSearch && matchesGenre;
  });

  const manejarSeleccion = (categoria) => {
    setCategoriaSeleccionada((prev) => (prev === categoria ? null : categoria));
  };

  if (books_list.length === 0 || gnres_list.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-4 mx-2 mt-4">
        No fue posible conectar con el servidor
      </div>
    );
  }

  return (
    <>
      {/* Genre filter row */}
      <div className="flex space-x-4 overflow-x-auto mx-2 py-4 px-1">
        {genres_.map((genre) => (
          <GenreCard
            key={genre.pk_id_genero}
            name={genre.genero}
            icon={genre.icon}
            onClick={() => manejarSeleccion(genre.genero)}
            activo={categoriaSeleccionada === genre.genero}
          />
        ))}
      </div>

      {/* Search bar */}
      <div className="flex justify-center items-center mt-6">
        <SearchBar onSearch={setSearchTerm} />
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-2 mt-4">
        {librosFiltrados.length > 0 ? (
          librosFiltrados.map((libro) => (
            <Card
              key={libro.pk_id_libro}
              id={libro.pk_id_libro}
              titulo={libro.titulo}
              autor={libro.autor}
              imagen={libro.ruta_img}
              categoria={libro.genero}
              copias={libro.copias}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-8">
            No se encontraron libros con ese término o género.
          </p>
        )}
        <ChatPopup />
      </div>
    </>
  );
}
