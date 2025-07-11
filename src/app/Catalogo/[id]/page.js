import Books from "../../data/books";

export default async function BookDetails(props) {
  const { id } = await props.params;

  const book = Books.find((b) => b.id.toString() === id);

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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-80 max-w-150 ">
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
          <div className="mt-6 flex justify-center">
            <button className="flex items-center justify-center mt-6 text-2xl font-bold bg-blue-500 text-white  py-3 rounded-lg hover:bg-blue-600 transition w-full max-w-md">
              <img
                src="/rfid.webp"
                alt="NFC Logo"
                className="w-20 mr-2 rounded"
              />
              Solcitar Libro
            </button>
          </div>
        </div>
      </div>
      <h1 className="pt-5 font-bold text-3xl text-center text-gray-800 ">
        Libros que podrian gustarte
      </h1>
    </div>
  );
}
