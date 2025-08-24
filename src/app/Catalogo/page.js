"use client";

import { useState } from "react";
import Card from "../Components/BookCard";
import GenreCard from "../Components/GenreCard";
import genres from "../data/genres";

export default function Biblioteca({ initialData }) {
  const [data] = useState(initialData);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const librosFiltrados = categoriaSeleccionada
    ? data.filter((book) => book.genero[0] === categoriaSeleccionada)
    : data;

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
        {librosFiltrados.map((libro) => (
          <Card
            key={libro.pk_id_libro}
            id={libro.pk_id_libro}
            titulo={libro.titulo}
            autor={libro.autor}
            imagen={libro.ruta_img}
            categoria={libro.genero[0]}
            copias={libro.copias}
          />
        ))}
      </div>
    </>
  );
}
