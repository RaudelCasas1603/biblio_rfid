"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../Components/ProtectedRoute";
import PerfilUsuario from "../Components/PerfilUsuario";

export default function User() {
  const [dataMensual, setDataMensual] = useState([]);
  const [historialPrestamos, setHistorialPrestamos] = useState([]);
  const [generosLeidos, setGenerosLeidos] = useState([]);
  const [prestamosTotales, setPrestamosTotales] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res1 = await fetch("/api/prestamo/mis_prestamos_por_mes_admin/");
        const res2 = await fetch("/api/prestamo/historial_prestamos_admin/5");
        const res3 = await fetch("/api/prestamo/mis_generos_leidos_admin/");
        const res4 = await fetch("/api/prestamo/prestamos_totales/");

        if (res1.ok) {
          const data = await res1.json();
          setDataMensual(data);
          console.log("Fetched data:", data); // log the fetched data
        } else {
          console.error("Error fetching data:", res1.status);
        }

        if (res2.ok) {
          const data = await res2.json();
          setHistorialPrestamos(data);
          console.log("Fetched data:", data);
        } else {
          console.error("Error fetching data:", res2.status);
        }

        if (res3.ok) {
          const data = await res3.json();
          setGenerosLeidos(data);
          console.log("Fetched data:", data);
        } else {
          console.error("Error fetching data:", res3.status);
        }

        if (res4.ok) {
          const data = await res4.json();
          setPrestamosTotales(data);
          console.log("Fetched data:", data);
        } else {
          console.error("Error fetching data:", res4.status);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <ProtectedRoute>
      <PerfilUsuario
        dataMensual={dataMensual}
        historialPrestamos={historialPrestamos}
        generosLeidos={generosLeidos}
        prestamosTotales={prestamosTotales}
      />
    </ProtectedRoute>
  );
}
