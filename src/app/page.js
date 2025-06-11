import Image from "next/image";
import Card from "./Components/BookCard";
import GenreCard from "./Components/GenreCard";

export default function Home() {
  return (
    <>
      <div className="flex display-inline space-x-4 overflow-x-auto mx-2">
        <GenreCard />
        <GenreCard />
        <GenreCard />
        <GenreCard />
        <GenreCard />
      </div>
      <div className="grid grid-cols-4 gap-4 mx-2 mt-4">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
}
