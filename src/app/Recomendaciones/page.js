"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Recomendaciones() {
  const [librosPopulares, setLibrosPopulares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resBooks = await fetch("/api/prestamo/populares/10");
        if (resBooks.ok) {
          const data = await resBooks.json();
          setLibrosPopulares(data);
        } else {
          console.error("Error fetching data:", resBooks.status);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Cargando libros...</p>;

  const top3 = librosPopulares.slice(0, 3);
  const restantes = librosPopulares.slice(3, 10);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center">Ranking</h1>
      <h2 className="text-2xl text-center text-gray-600 mb-8">
        Libros más populares de la biblioteca
      </h2>

      {/* Top 3 destacados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {top3.map((libro, index) => (
          <div
            key={libro.pk_id_libro}
            className="bg-yellow-100 border-l-4 border-yellow-500 shadow-lg rounded-xl overflow-hidden"
          >
            <img
              src={libro.ruta_img}
              alt={libro.titulo}
              className="w-full h-150 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-yellow-800">
                🏆 Top {index + 1}: {libro.titulo}
              </h2>
              <p className="text-sm text-gray-700">Autor: {libro.autor}</p>
              <p className="text-sm text-gray-700">Categoría: {libro.genero}</p>
              <p className="text-sm text-gray-700">Copias disponibles: {libro.copias}</p>
              <Link
                href={`/Catalogo/${libro.pk_id_libro}`}
                className="text-white bg-blue-500 inline-block mt-2 rounded-2xl px-3 py-1 hover:bg-blue-600 transition-colors duration-300"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Libros 4 al 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restantes.map((libro, index) => (
          <div
            key={libro.pk_id_libro}
            className="bg-white border shadow-md rounded-xl overflow-hidden flex"
          >
            <img
              src={libro.ruta_img}
              alt={libro.titulo}
              className="w-32 h-50 object-cover"
            />
            <div className="p-4 flex flex-col justify-center">
              <p className="text-gray-500 text-sm font-bold">#{index + 4}</p>
              <h3 className="text-lg font-semibold">{libro.titulo}</h3>
              <p className="text-sm text-gray-700">{libro.autor}</p>
              <p className="text-sm text-gray-600">{libro.genero}</p>
              <p className="text-sm text-gray-600">
                Copias disponibles: {libro.copias}
              </p>
              <Link
                href={`/Catalogo/${libro.pk_id_libro}`}
                className="text-white bg-blue-500 px-3 mt-2 w-30 text-center rounded-2xl py-1 hover:bg-blue-600 transition-colors duration-300"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
