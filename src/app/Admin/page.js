"use client";
import ProtectedRoute from "../Components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { usuario } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Bienvenido, {usuario?.nombre}
      </h1>
      <p className="text-gray-700 mb-8">
        Este es tu panel de administrador. Aquí puedes gestionar usuarios,
        libros y ver estadísticas del sistema.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Secciones de administración */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Gestión de Usuarios
          </h2>
          <p className="text-gray-600 text-sm">
            Ver, editar o eliminar usuarios registrados.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Gestión de Libros
          </h2>
          <p className="text-gray-600 text-sm">
            Agregar, editar o eliminar libros del catálogo.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Estadísticas
          </h2>
          <p className="text-gray-600 text-sm">
            Visualiza préstamos, libros más leídos y más.
          </p>
        </div>
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
