"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ------------------- Datos DEMO (simula  API) ------------------- */
const DEMO = {
  resumen: { usuarios: 128, libros: 542, prestamosTotal: 3672 },
  prestamosPorDia: [
    { d: "2025-08-07", n: 12 },
    { d: "2025-08-08", n: 9 },
    { d: "2025-08-09", n: 15 },
    { d: "2025-08-10", n: 14 },
    { d: "2025-08-11", n: 21 },
    { d: "2025-08-12", n: 19 },
    { d: "2025-08-13", n: 18 },
    { d: "2025-08-14", n: 16 },
    { d: "2025-08-15", n: 22 },
    { d: "2025-08-16", n: 25 },
    { d: "2025-08-17", n: 17 },
    { d: "2025-08-18", n: 20 },
    { d: "2025-08-19", n: 19 },
    { d: "2025-08-20", n: 18 },
  ],
  inventarioPorEstado: { disponible: 410, prestado: 112, mantenimiento: 20 },
  topLibros: [
    { titulo: "Cien años de soledad", prestamos: 124 },
    { titulo: "Pedro Páramo", prestamos: 98 },
    { titulo: "El laberinto de la soledad", prestamos: 75 },
    { titulo: "Rayuela", prestamos: 69 },
    { titulo: "La sombra del viento", prestamos: 55 },
  ],
  usuariosActivos: [
    { nombre: "María López", prestamos: 22 },
    { nombre: "Juan Pérez", prestamos: 19 },
    { nombre: "Ana Gómez", prestamos: 17 },
    { nombre: "Luis Romero", prestamos: 15 },
    { nombre: "Sofía Díaz", prestamos: 12 },
  ],
};

/* ------------------- Utils ------------------- */
const toCSV = (rows) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replaceAll(`"`, `""`)}"`;
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(","));
  return lines.join("\n");
};
const download = (content, filename, mime = "text/csv;charset=utf-8;") => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

function KPI({ title, value, hint }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-semibold text-gray-800">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

const COLORS = ["#22c55e", "#f59e0b", "#9ca3af"]; // disponible, prestado, mantenimiento

export default function AdminStatistics() {
  const [dias, setDias] = useState(14);

  // En prod: useEffect(() => fetch(`/api/stats?dias=${dias}`).then(...), [dias])
  const lineaPrestamos = useMemo(
    () =>
      DEMO.prestamosPorDia
        .slice(-dias)
        .map((x) => ({ fecha: x.d.slice(5), prestamos: x.n })),
    [dias]
  );

  const totalPeriodo = useMemo(
    () => lineaPrestamos.reduce((a, b) => a + b.prestamos, 0),
    [lineaPrestamos]
  );

  const prevComparacion = useMemo(() => {
    const prev = DEMO.prestamosPorDia.slice(-(dias * 2), -dias);
    const prevTotal = prev.reduce((a, b) => a + b.n, 0) || 1;
    const diff = totalPeriodo - prevTotal;
    const pct = ((diff / prevTotal) * 100).toFixed(1);
    return { diff, pct, up: diff >= 0 };
  }, [dias, totalPeriodo]);

  const barrasTop = useMemo(
    () =>
      DEMO.topLibros.map((l) => ({ name: l.titulo, prestamos: l.prestamos })),
    []
  );

  const pieInventario = useMemo(() => {
    const entries = Object.entries(DEMO.inventarioPorEstado); // [[k, v], ...]
    return entries.map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header + Filtro */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Estadísticas del Sistema
            </h1>
            <p className="text-gray-600 mt-1">
              Usuarios, libros y préstamos en el periodo seleccionado.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rango: </label>
            <select
              className="border bg-white rounded px-3 py-2 text-sm"
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}>
              <option value={7}>Últimos 7 días</option>
              <option value={14}>Últimos 14 días</option>
              <option value={30}>Últimos 30 días</option>
            </select>
            <button
              onClick={() => {
                const csv = toCSV(
                  lineaPrestamos.map(({ fecha, prestamos }) => ({
                    fecha,
                    prestamos,
                  }))
                );
                download(csv, `prestamos_${dias}d.csv`);
              }}
              className="ml-2 rounded bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700">
              Exportar CSV
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPI
            title="Usuarios"
            value={DEMO.resumen.usuarios}
            hint="Total registrados"
          />
          <KPI title="Libros" value={DEMO.resumen.libros} hint="En catálogo" />
          <KPI
            title="Préstamos (periodo)"
            value={totalPeriodo}
            hint={
              prevComparacion.up
                ? `+${prevComparacion.pct}% vs periodo previo`
                : `${prevComparacion.pct}% vs previo`
            }
          />
          <KPI
            title="Acumulado histórico"
            value={DEMO.resumen.prestamosTotal}
            hint="Desde el inicio"
          />
        </div>

        {/* Grilla principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Línea */}
          <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Préstamos por día
              </h3>
              <span
                className={`text-xs ${
                  prevComparacion.up ? "text-green-600" : "text-rose-600"
                }`}>
                {prevComparacion.up ? "▲" : "▼"}{" "}
                {Math.abs(prevComparacion.diff)} ({prevComparacion.pct}%)
              </span>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart
                  data={lineaPrestamos}
                  margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="prestamos"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Inventario por estado
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieInventario}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label>
                    {pieInventario.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Barras Top libros */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Libros más prestados
              </h3>
              <button
                onClick={() => {
                  const csv = toCSV(DEMO.topLibros);
                  download(csv, "top_libros.csv");
                }}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-50">
                Exportar
              </button>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer>
                <BarChart
                  data={barrasTop}
                  margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="prestamos" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla usuarios activos */}
          <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Usuarios más activos
              </h3>
              <Link
                href="/Admin/AdUsuarios"
                className="text-blue-600 text-sm hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2">Usuario</th>
                    <th className="px-4 py-2">Préstamos</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {DEMO.usuariosActivos.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{u.nombre}</td>
                      <td className="px-4 py-2">{u.prestamos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
