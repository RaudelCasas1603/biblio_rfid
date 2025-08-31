"use client"; // make this a client component

import { useEffect, useState } from "react";
import Biblioteca from "./Catalogo/page";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [gnres, setGnres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Client-side fetch using /api (rewrites handle backend URL)
        const resBooks = await fetch("/api/libro/get/ultimos/50");
        if (resBooks.ok) {
          const booksData = await resBooks.json();
          setBooks(booksData);
        } else {
          console.error("Error fetching books:", resBooks.status);
        }

        const resGenres = await fetch("/api/generos");
        if (resGenres.ok) {
          const genresData = await resGenres.json();
          setGnres(genresData);
        } else {
          console.error("Error fetching genres:", resGenres.status);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return <Biblioteca books_list={books} gnres_list={gnres} />;
}
