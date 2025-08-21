import Link from "next/link";

export default function liberarLibro() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Liberar Libro</h1>
      <p className="text-lg text-gray-700 mb-8">
        Esta página está en construcción.
      </p>
      <Link href="/Catalogo" className="text-blue-500 hover:underline">
        Volver al Catálogo
      </Link>
    </div>
  );
}
