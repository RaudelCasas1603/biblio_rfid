"use client";
import { useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../Components/ProtectedRoute"; // verifica la ruta/capitalización
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBook,
  faChartLine,
  faArrowUpRightDots,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

function MetricCard({ title, value, delta, up = true, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
        <FontAwesomeIcon icon={icon} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
        <div
          className={`text-xs mt-1 ${
            up ? "text-green-600" : "text-rose-600"
          } flex items-center gap-1`}>
          <FontAwesomeIcon icon={up ? faArrowUpRightDots : faArrowDown} />
          {delta}
        </div>
      </div>
    </div>
  );
}

function MiniBar({ data }) {
  // data: números 0-100 (porcentaje relativo)
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-blue-500/20 rounded-t"
          style={{ height: `${(v / max) * 100}%` }}
          title={`${v}`}
        />
      ))}
    </div>
  );
}

function AdminDashboard() {
  const { usuario } = useAuth();

  // Datos demo (luego cámbialos por fetch a la API)
  const metrics = {
    usuarios: { total: 128, delta: "+6 esta semana", up: true },
    libros: { total: 542, delta: "+12 este mes", up: true },
    prestamosHoy: { total: 18, delta: "-3 vs ayer", up: false },
  };

  const topLibros = [
    { titulo: "Cien años de soledad", prestamos: 124 },
    { titulo: "Pedro Páramo", prestamos: 98 },
    { titulo: "El laberinto de la soledad", prestamos: 75 },
  ];

  const seriePrestamos7d = [12, 9, 15, 14, 21, 19, 18]; // últimos 7 días

  useEffect(() => {
    // Aquí puedes disparar un toast o cargar datos reales
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6 md:p-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Hola{usuario?.nombre ? `, ${usuario.nombre}` : ""} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Este es tu panel de administrador. Gestiona usuarios, libros y revisa
          el pulso del sistema.
        </p>
      </header>

      {/* Métricas rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Usuarios registrad@s"
          value={metrics.usuarios.total}
          delta={metrics.usuarios.delta}
          up={metrics.usuarios.up}
          icon={faUsers}
        />
        <MetricCard
          title="Libros en catálogo"
          value={metrics.libros.total}
          delta={metrics.libros.delta}
          up={metrics.libros.up}
          icon={faBook}
        />
        <MetricCard
          title="Préstamos hoy"
          value={metrics.prestamosHoy.total}
          delta={metrics.prestamosHoy.delta}
          up={metrics.prestamosHoy.up}
          icon={faChartLine}
        />
      </section>

      {/* Tarjetas de navegación */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/Admin/AdUsuarios" className="group">
          <div className="flex flex-col items-center bg-gray-800 shadow-md rounded-xl p-6 group-hover:bg-gray-700 transition duration-200 h-full">
            <h2 className="text-xl font-semibold text-white mb-2">
              Gestión de Usuarios
            </h2>
            <div className="bg-white w-36 h-36 rounded-full flex items-center justify-center shadow-md my-4">
              <img
                src="/icons/users.webp"
                alt="users Icon"
                className="w-28 h-28"
              />
            </div>
            <p className="text-white/90 text-center">
              Ver, editar o eliminar usuarios registrados.
            </p>
          </div>
        </Link>

        <Link href="/Admin/AdLibros" className="group">
          <div className="flex flex-col items-center bg-gray-800 shadow-md rounded-xl p-6 group-hover:bg-gray-700 transition duration-200 h-full">
            <h2 className="text-xl font-semibold text-white mb-2">
              Gestión de Libros
            </h2>
            <div className="bg-white w-36 h-36 rounded-full flex items-center justify-center shadow-md my-4">
              <img
                src="/icons/books.webp"
                alt="books Icon"
                className="w-28 h-28"
              />
            </div>
            <p className="text-white/90 text-center">
              Agregar, editar o eliminar libros del catálogo.
            </p>
          </div>
        </Link>

        <Link href="/Admin/Estadisticas" className="group">
          <div className="flex flex-col items-center bg-gray-800 shadow-md rounded-xl p-6 group-hover:bg-gray-700 transition duration-200 h-full">
            <h2 className="text-xl font-semibold text-white mb-2">
              Estadísticas
            </h2>
            <div className="bg-white w-36 h-36 rounded-full flex items-center justify-center shadow-md my-4">
              <img
                src="/icons/statistics.webp"
                alt="statistics Icon"
                className="w-28 h-28"
              />
            </div>
            <p className="text-white/90 text-center">
              Visualiza préstamos, libros más leídos y más.
            </p>
          </div>
        </Link>
      </section>

      {/* Gráfico simple + Top libros */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Préstamos (últimos 7 días)
            </h3>
            <span className="text-xs text-gray-500">Demo</span>
          </div>
          <MiniBar data={seriePrestamos7d} />
          <div className="mt-3 text-sm text-gray-500">
            Total:{" "}
            <strong>{seriePrestamos7d.reduce((a, b) => a + b, 0)}</strong>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Top libros
          </h3>
          <ul className="space-y-3">
            {topLibros.map((l, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className="text-gray-700">{l.titulo}</span>
                <span className="text-gray-500 text-sm">
                  {l.prestamos} préstamos
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
