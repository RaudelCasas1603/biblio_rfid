import Biblioteca from "./Catalogo/page";

export default async function Home() {
  // Server-side fetch
  const res = await fetch("http://127.0.0.1:8000/libro/get/ultimos/50", { cache: "no-store" });
  const data = await res.json();

  // Pass data to client component
  return <Biblioteca initialData={data} />;
}
