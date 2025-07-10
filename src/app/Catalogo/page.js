import Card from "../Components/BookCard";
import Books from "../data/books"; // Importa los libros desde el archivo de datos

export default function Biblioteca() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mx-2 mt-4">
        {Books.map((book) => (
          <Card
            key={book.id}
            id={book.id}
            titulo={book.titulo}
            autor={book.autor}
            imagen={book.imagen}
          />
        ))}
      </div>
    </>
  );
}
