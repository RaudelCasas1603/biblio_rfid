"use client";

import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function PerfilUsuario({
  dataMensual,
  historialPrestamos,
  generosLeidos,
  prestamosTotales,
}) {
  const { usuario, logout } = useAuth();
  //const prestamosTotales = 45;

  const colores = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center w-full px-4 pt-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-8">
          Perfil de Usuario
        </h1>

        {/* Tarjeta de perfil */}
        <div className="bg-white rounded-xl shadow-lg px-8 py-6 max-w-sm w-full text-center">
          <img
            src={usuario?.avatar || "/profile.webp"}
            alt="Avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 shadow-md border-2 border-blue-200"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            {usuario?.nombre}
          </h2>
          <p className="text-sm text-gray-500">{usuario?.correo}</p>

          <div className="text-sm text-gray-700 text-left mt-4 space-y-1">
            <p>
              <span className="font-semibold">Rol:</span> {usuario?.rol}
            </p>
            <p>
              <span className="font-semibold">Miembro desde:</span> 2024-03-14
            </p>
          </div>

          <div className="flex space-x-3 justify-center">
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition shadow-md">
              Editar perfil
            </button>
            <button
              onClick={logout}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition shadow-md">
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="w-full max-w-4xl mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center min-h-[350px] w-full">
            <h2 className="text-3xl font-semibold text-gray-700 mb-2">
              Libros prestados
            </h2>
            <h2 className="text-6xl font-bold text-blue-600">
              {prestamosTotales}
            </h2>
            <p className="text-xl text-gray-500">en total</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 min-h-[350px] w-full flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Préstamos mensuales
            </h3>
            <div className="w-full max-w-md mr-10">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="prestamos"
                    stroke="#2563EB"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 min-h-[350px] w-1/2 mt-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center ">
            Géneros leídos
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={generosLeidos}
                dataKey="cantidad"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label>
                {generosLeidos.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colores[index % colores.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
