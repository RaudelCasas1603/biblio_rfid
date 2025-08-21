import Books from "../../data/books";
import Link from "next/link";

export default async function BookDetails(props) {
  const { id } = await props.params;

  const book = Books.find((b) => b.id.toString() === id);
  const recomendaciones = Books.filter(
    (b) => b.id !== book.id && b.categoria === book.categoria
  ).slice(0, 4);

  if (!book)
    return (
      <p className="text-center text-red-600 mt-10">Libro no encontrado</p>
    );

  return (
    <div className="px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 pt-10">
        Detalles del Libro
      </h1>
      <div className=" mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="flex justify-center">
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <img
              src={book.imagen}
              alt={book.titulo}
              className="max-h-[600px] object-contain rounded-md"
            />
          </div>
        </div>
        {/* Texto */}
        <div>
          <div className="bg-white  rounded-xl shadow-lg p-6 border border-gray-200 h-80 max-w-150 ">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b pb-2">
              {book.titulo}
            </h1>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li>
                <span className="font-semibold text-gray-800">Autor:</span>{" "}
                {book.autor}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Categoria:</span>{" "}
                {book.categoria}
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
              <li>
                <span className="font-semibold text-gray-800">
                  Copias disponibles:
                </span>{" "}
                {book.copias}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {recomendaciones.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Libros que podrían gustarte
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recomendaciones.map((libro) => (
              <Link key={libro.id} href={`/Catalogo/${libro.id}`}>
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition cursor-pointer">
                  <img
                    src={libro.imagen}
                    alt={libro.titulo}
                    className="h-120 w-full object-cover rounded"
                  />
                  <h3 className="text-lg font-semibold mt-3">{libro.titulo}</h3>
                  <p className="text-sm text-gray-600">{libro.autor}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
