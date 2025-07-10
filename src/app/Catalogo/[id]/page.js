import Books from "../../data/books"; // Ajusta si es necesario según tu estructura

export default async function BookDetails(props) {
  const { id } = await props.params; // 👈 silencia el warning de Next.js

  const book = Books.find((b) => b.id.toString() === id);

  if (!book)
    return (
      <p className="text-center text-red-600 mt-10">Libro no encontrado</p>
    );

  return (
    <div className="pt-20 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Texto */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b pb-2">
            {book.titulo}
          </h1>
          <ul className="space-y-3 text-gray-700 text-lg">
            <li>
              <span className="font-semibold text-gray-800">Autor:</span>{" "}
              {book.autor}
            </li>
            <li>
              <span className="font-semibold text-gray-800">ISBN:</span>{" "}
              {book.isbn}
            </li>
            <li>
              <span className="font-semibold text-gray-800">
                Fecha de publicación:
              </span>{" "}
              {book.fecha_publicacion}
            </li>
          </ul>
        </div>

        {/* Imagen */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <img
              src={book.imagen}
              alt={book.titulo}
              className="max-h-[500px] object-contain rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
