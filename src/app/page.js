import Card from "./Components/BookCard";
import GenreCard from "./Components/GenreCard";

const Books = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    isbn: "9788497592208",
    fecha_publicacion: "1967-05-30",
    rfid: null,
    imagen: "Portadas_Libros/Cien_años_de_soledad.jpg",
    copias: 1,
  },
  {
    id: 2,
    titulo: "1984",
    autor: "George Orwell",
    isbn: "9780451524935",
    fecha_publicacion: "1949-06-08",
    rfid: null,
    imagen: "Portadas_Libros/1984.jpg",
    copias: 1,
  },
  {
    id: 3,
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    isbn: "9788491050292",
    fecha_publicacion: "1605-01-16",
    rfid: null,
    imagen: "Portadas_Libros/Don_Quijote_de_la_Mancha.webp",
    copias: 1,
  },
  {
    id: 4,
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    isbn: "9780141439518",
    fecha_publicacion: "1813-01-28",
    rfid: null,
    imagen: "Portadas_Libros/Orgullo_y_prejuicio.jpg",
    copias: 1,
  },
  {
    id: 5,
    titulo: "Crimen y castigo",
    autor: "Fiódor Dostoyevski",
    isbn: "9780140449136",
    fecha_publicacion: "1866-01-01",
    rfid: null,
    imagen: "Portadas_Libros/Crimen_y_castigo.jpg",
    copias: 1,
  },
  {
    id: 6,
    titulo: "Matar a un ruiseñor",
    autor: "Harper Lee",
    isbn: "9780060935467",
    fecha_publicacion: "1960-07-11",
    rfid: null,
    imagen: "Portadas_Libros/Matar_a_un_ruiseñor.jpg",
    copias: 1,
  },
  {
    id: 7,
    titulo: "El Gran Gatsby",
    autor: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    fecha_publicacion: "1925-04-10",
    rfid: null,
    imagen: "Portadas_Libros/El_Gran_Gatsby.jpg",
    copias: 1,
  },
  {
    id: 8,
    titulo: "En busca del tiempo perdido",
    autor: "Marcel Proust",
    isbn: "9782070401903",
    fecha_publicacion: "1913-11-14",
    rfid: null,
    imagen: "Portadas_Libros/En_busca_del_tiempo_perdido.webp",
    copias: 1,
  },
  {
    id: 9,
    titulo: "Ulises",
    autor: "James Joyce",
    isbn: "9780141182803",
    fecha_publicacion: "1922-02-02",
    rfid: null,
    imagen: "Portadas_Libros/Ulises.jpg",
    copias: 1,
  },
];

const genres = [
  { id: 1, name: "Ficción", icon: "fa-solid fa-book" },
  { id: 2, name: "No Ficción", icon: "fa-solid fa-newspaper" },
  { id: 3, name: "Ciencia", icon: "fa-solid fa-flask" },
  { id: 4, name: "Historia", icon: "fa-solid fa-landmark" },
];

export default function Home() {
  return (
    <>
      <div className="flex display-inline space-x-4 overflow-x-auto mx-2">
        {genres.map((genre) => (
          <GenreCard key={genre.id} name={genre.name} icon={genre.icon} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 mx-2 mt-4">
        {Books.map((book) => (
          <Card
            key={book.id}
            titulo={book.titulo}
            autor={book.autor}
            imagen={book.imagen}
          />
        ))}
      </div>
    </>
  );
}
