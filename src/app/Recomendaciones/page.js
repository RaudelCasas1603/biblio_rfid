import Link from "next/link";

export default function Recomendaciones() {
  const librosPopulares = [
    {
      id: 1,
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      isbn: "9788497592208",
      fecha_publicacion: "1967-05-30",
      rfid: null,
      imagen: "/Portadas_Libros/cien_anos_de_soledad.webp",
      copias: 1,
      genero: "Realismo mágico",
      categoria: "Ficción",
    },
    {
      id: 2,
      titulo: "1984",
      autor: "George Orwell",
      isbn: "9780451524935",
      fecha_publicacion: "1949-06-08",
      rfid: null,
      imagen: "/Portadas_Libros/1984.webp",
      copias: 1,
      genero: "Distopía",
      categoria: "Ficción",
    },
    {
      id: 3,
      titulo: "Don Quijote de la Mancha",
      autor: "Miguel de Cervantes",
      isbn: "9788491050292",
      fecha_publicacion: "1605-01-16",
      rfid: null,
      imagen: "/Portadas_Libros/don_quijote_de_la_mancha.webp",
      copias: 1,
      genero: "Novela clásica",
      categoria: "Ficción",
    },
    {
      id: 4,
      titulo: "Orgullo y prejuicio",
      autor: "Jane Austen",
      isbn: "9780141439518",
      fecha_publicacion: "1813-01-28",
      rfid: null,
      imagen: "/Portadas_Libros/orgullo_y_prejuicio.webp",
      copias: 1,
      genero: "Romance",
      categoria: "Ficción",
    },
    {
      id: 5,
      titulo: "Crimen y castigo",
      autor: "Fiódor Dostoyevski",
      isbn: "9780140449136",
      fecha_publicacion: "1866-01-01",
      rfid: null,
      imagen: "/Portadas_Libros/crimen_y_castigo.webp",
      copias: 1,
      genero: "Ficción psicológica",
      categoria: "Ficción",
    },
    {
      id: 6,
      titulo: "Matar a un ruiseñor",
      autor: "Harper Lee",
      isbn: "9780060935467",
      fecha_publicacion: "1960-07-11",
      rfid: null,
      imagen: "/Portadas_Libros/matar_a_un_ruisenor.webp",
      copias: 1,
      genero: "Drama social",
      categoria: "Ficción",
    },
    {
      id: 7,
      titulo: "El Gran Gatsby",
      autor: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      fecha_publicacion: "1925-04-10",
      rfid: null,
      imagen: "/Portadas_Libros/el_gran_gatsby.webp",
      copias: 1,
      genero: "Ficción clásica",
      categoria: "Ficción",
    },
    {
      id: 8,
      titulo: "En busca del tiempo perdido",
      autor: "Marcel Proust",
      isbn: "9782070401903",
      fecha_publicacion: "1913-11-14",
      rfid: null,
      imagen: "/Portadas_Libros/en_busca_del_tiempo_perdido.webp",
      copias: 1,
      genero: "Modernismo",
      categoria: "Ficción",
    },
    {
      id: 9,
      titulo: "Ulises",
      autor: "James Joyce",
      isbn: "9780141182803",
      fecha_publicacion: "1922-02-02",
      rfid: null,
      imagen: "/Portadas_Libros/ulises.webp",
      copias: 1,
      genero: "Modernismo",
      categoria: "Ficción",
    },
    {
      id: 10,
      titulo: "La Odisea",
      autor: "Homero",
      isbn: "9780140268867",
      fecha_publicacion: "0800-01-01",
      rfid: null,
      imagen: "/Portadas_Libros/la_odisea.webp",
      copias: 1,
      genero: "Épica",
      categoria: "Poesía",
    },
  ];

  const top3 = librosPopulares.slice(0, 3);
  const restantes = librosPopulares.slice(3, 10);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center">Rankig</h1>
      <h2 className="text-2xl text-center text-gray-600 mb-8">
        Libros más populares de la biblioteca
      </h2>

      {/* Top 3 destacados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {top3.map((libro, index) => (
          <div
            key={libro.id}
            className="bg-yellow-100 border-l-4 border-yellow-500 shadow-lg rounded-xl overflow-hidden">
            <img
              src={libro.imagen}
              alt={libro.titulo}
              className="w-full h-150 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-yellow-800">
                🏆 Top {index + 1}: {libro.titulo}
              </h2>
              <p className="text-sm text-gray-700">Autor: {libro.autor}</p>
              <p className="text-sm text-gray-700">
                Categoría: {libro.categoria}
              </p>
              <p className="text-sm text-gray-700">
                Copias disponibles: {libro.copias}
              </p>
              <Link
                href={`/Catalogo/${libro.id}`}
                className="text-white bg-blue-500 inline-block mt-2 rounded-2xl px-3 py-1 hover:bg-blue-600 transition-colors duration-300">
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
            key={libro.id}
            className="bg-white border shadow-md rounded-xl overflow-hidden flex">
            <img
              src={libro.imagen}
              alt={libro.titulo}
              className="w-32 h-50 object-cover"
            />
            <div className="p-4 flex flex-col justify-center">
              <p className="text-gray-500 text-sm font-bold">#{index + 4}</p>
              <h3 className="text-lg font-semibold">{libro.titulo}</h3>
              <p className="text-sm text-gray-700">{libro.autor}</p>
              <p className="text-sm text-gray-600">{libro.categoria}</p>
              <p className="text-sm text-gray-600">
                Copias disponibles: {libro.copias}
              </p>
              <Link
                href={`/Catalogo/${libro.id}`}
                className="text-white bg-blue-500 px-3 mt-2 w-30 text-center rounded-2xl py-1 hover:bg-blue-600 transition-colors duration-300">
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
