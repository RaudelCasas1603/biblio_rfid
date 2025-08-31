"use client";
import { useEffect, useState } from "react";

import AdminDashboard from "../Components/AdminDashboard";
import ProtectedRoute from "../Components/ProtectedRoute"; // verifica la ruta/capitalización
export default function AdminPage() {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
          const res1 = await fetch("/api/usuario/get_panel_a_estadisticas/");
          if (res1.ok) {
            const data = await res1.json();
            setStatistics(data);
            console.log("Fetched data:", data); // log the fetched data
          } else {
            console.error("Error fetching data:", res1.status);
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
    <ProtectedRoute requireAdmin>
      <AdminDashboard statistics={statistics}/>
    </ProtectedRoute>
  );
}
