"use client";
import Card from "../Components/BookCard";
import GenreCard from "../Components/GenreCard";
import Books from "../data/books";
import genres from "../data/genres";
import { useState } from "react";

export default function Biblioteca() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const librosFiltrados = categoriaSeleccionada
    ? Books.filter((book) => book.categoria === categoriaSeleccionada)
    : Books;

  const manejarSeleccion = (categoria) => {
    setCategoriaSeleccionada((prev) => (prev === categoria ? null : categoria));
  };

  return (
    <>
      <div className="flex space-x-4 overflow-x-auto mx-2 py-4 px-1">
        {genres.map((genre) => (
          <GenreCard
            key={genre.id}
            name={genre.name}
            icon={genre.icon}
            onClick={() => manejarSeleccion(genre.name)}
            activo={categoriaSeleccionada === genre.name}
          />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mx-2 mt-4">
        {librosFiltrados.map((book) => (
          <Card
            key={book.id}
            id={book.id}
            titulo={book.titulo}
            autor={book.autor}
            imagen={book.imagen}
            categoria={book.categoria}
            copias={book.copias}
          />
        ))}
      </div>
    </>
  );
}
