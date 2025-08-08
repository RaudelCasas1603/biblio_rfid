import Link from "next/link";

export default function Card({ id, titulo, autor, imagen, categoria, copias }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm">
      {imagen && (
        <div className="flex justify-center items-center mb-4">
          {" "}
          {/* Contenedor flex para centrar */}
          <img src={imagen} alt={titulo} className="w-auto h-100 rounded-lg" />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
      <p className="text-gray-700 mb-4">{autor}</p>
      <p className="text-gray-700 mb-4">
        <span className="font-semibold text-gray-800">Categoria:</span>{" "}
        {categoria}
      </p>
      <p className="text-gray-600 mb-4">Copias disponibles: {copias}</p>
      {/* Botón para ver detalles del libro */}
      <Link href={`/Catalogo/${id}`}>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">
          Ver Detalles
        </button>
      </Link>
    </div>
  );
}
