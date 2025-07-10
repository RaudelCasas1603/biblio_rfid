import Link from "next/link";

export default function Card({ id, titulo, autor, imagen }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm border-black-2 border-2">
      {imagen && (
        <div className="flex justify-center items-center mb-4">
          {" "}
          {/* Contenedor flex para centrar */}
          <img src={imagen} alt={titulo} className="w-auto h-100 rounded-lg" />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
      <p className="text-gray-700 mb-4">{autor}</p>
      <Link href={`/Catalogo/${id}`}>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">
          Ver Detalles
        </button>
      </Link>
    </div>
  );
}
