"use client";
import ProtectedRoute from "../Components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

function AdminDashboard() {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 pt-10">
      <h1 className="text-2xl text-gray-700 mb-10 text-center font-bold max-w-3xl">
        Este es tu panel de administrador. Aquí puedes gestionar usuarios,
        libros y ver estadísticas del sistema.
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-8xl text-center mt-10">
        <Link href={"/Admin/AdUsuarios"}>
          {/* TARJETA 1 */}
          <div className="flex flex-col items-center bg-gray-800 shadow-md rounded-lg p-6 hover:bg-gray-600 transition duration-200 h-84">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Gestión de Usuarios
            </h2>
            <div className="bg-white w-40 h-40 rounded-full flex items-center justify-center shadow-md my-4">
              <img
                src="/icons/users.webp"
                alt="users Icon"
                className="w-30 h-30"
              />
            </div>
            <p className="text-white text-lg">
              Ver, editar o eliminar usuarios registrados.
            </p>
          </div>
        </Link>
        {/* TARJETA 2 */}
        <Link href={"Admin/AdLibros"}>
          <div className="flex flex-col items-center bg-gray-800 shadow-md rounded-lg p-6 hover:bg-gray-600 transition duration-200">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Gestión de Libros
            </h2>
            <div className="bg-white w-40 h-40 rounded-full flex items-center justify-center shadow-md my-4">
              <img
                src="/icons/books.webp"
                alt="books Icon"
                className="w-30 h-30"
              />
            </div>
            <p className="text-white text-lg">
              Agregar, editar o eliminar libros del catálogo.
            </p>
          </div>
        </Link>
        {/* TARJETA 3 */}
        <Link href={"/Admin/Estadisticas"}>
          <div className="flex flex-col items-center bg-gray-800 shadow-md rounded-lg p-6 hover:bg-gray-600 transition duration-200">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Estadísticas
            </h2>
            <div className="bg-white w-40 h-40 rounded-full flex items-center justify-center shadow-md my-4">
              <img
                src="/icons/statistics.webp"
                alt="statistics Icon"
                className="w-30 h-30"
              />
            </div>
            <p className="text-white text-lg">
              Visualiza préstamos, libros más leídos y más.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
