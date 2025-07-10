import Biblioteca from "./Catalogo/page";
import GenreCard from "./Components/GenreCard";

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
      <Biblioteca />
    </>
  );
}
