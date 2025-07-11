import Biblioteca from "./Catalogo/page";
import GenreCard from "./Components/GenreCard";
import {
  faBookOpen,
  faHatWizard,
  faBrain,
  faGhost,
  faMasksTheater,
  faFeatherPointed,
  faUserSecret,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

const genres = [
  { id: 1, name: "Ficción", icon: faBookOpen },
  { id: 2, name: "Fantasía", icon: faHatWizard },
  { id: 3, name: "Filosofía", icon: faBrain },
  { id: 4, name: "Terror", icon: faGhost },
  { id: 5, name: "Teatro", icon: faMasksTheater },
  { id: 6, name: "Poesía", icon: faFeatherPointed },
  { id: 7, name: "Suspenso", icon: faUserSecret },
  { id: 8, name: "Otros", icon: faFolder },
];

export default function Home() {
  return (
    <>
      <div className="flex space-x-4 overflow-x-auto mx-2 py-4 px-1">
        {genres.map((genre) => (
          <GenreCard key={genre.id} name={genre.name} icon={genre.icon} />
        ))}
      </div>
      <Biblioteca />
    </>
  );
}
