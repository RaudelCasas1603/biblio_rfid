"use client";
import { useEffect, useState } from "react";

export default function HistorialPrestamos() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistorial() {
      try {
        const res = await fetch("/api/prestamo/historial_prestamos_admin/10");
        if (res.ok) {
          const data = await res.json();
          setHistorial(data);
        } else {
          console.error("Error al obtener historial:", res.status);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistorial();
  }, []);

  if (loading) return <p>Cargando historial...</p>;

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Historial de Préstamos
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Género
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha Préstamo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha Devolución
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historial.map((p) => (
              <tr key={p.pk_id_prestamo}>
                <td className="px-6 py-4">{p.titulo}</td>
                <td className="px-6 py-4">{p.autor}</td>
                <td className="px-6 py-4">{p.genero}</td>
                <td className="px-6 py-4">
                  {new Date(p.fecha_prestamo).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {p.estatus_entrega
                    ? new Date(p.fecha_entrega).toLocaleDateString()
                    : "Pendiente"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
