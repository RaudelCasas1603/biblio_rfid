"use client";

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
import { useAuth } from "../context/AuthContext";

function PerfilUsuario() {
  const { usuario, logout } = useAuth();

  const prestamosTotales = 45;

  const dataMensual = [
    { mes: "Ene", prestamos: 4 },
    { mes: "Feb", prestamos: 7 },
    { mes: "Mar", prestamos: 10 },
    { mes: "Abr", prestamos: 6 },
    { mes: "May", prestamos: 12 },
    { mes: "Jun", prestamos: 9 },
    { mes: "Jul", prestamos: 10 },
    { mes: "Ago", prestamos: 8 },
    { mes: "Sep", prestamos: 11 },
    { mes: "Oct", prestamos: 5 },
    { mes: "Nov", prestamos: 7 },
    { mes: "Dic", prestamos: 9 },
  ];
  const generosLeidos = [
    { nombre: "Ficción", cantidad: 8 },
    { nombre: "Ciencia", cantidad: 4 },
    { nombre: "Historia", cantidad: 6 },
    { nombre: "Fantasía", cantidad: 3 },
    { nombre: "Biografía", cantidad: 2 },
  ];
  const historialPrestamos = [
    {
      id: 1,
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      genero: "Ficción",
      fechaPrestamo: "2025-06-10",
      fechaDevolucion: "2025-06-20",
      devuelto: true,
    },
    {
      id: 2,
      titulo: "Breves respuestas a las grandes preguntas",
      autor: "Stephen Hawking",
      genero: "Ciencia",
      fechaPrestamo: "2025-07-01",
      fechaDevolucion: "2025-07-10",
      devuelto: true,
    },
    {
      id: 3,
      titulo: "El origen de las especies",
      autor: "Charles Darwin",
      genero: "Ciencia",
      fechaPrestamo: "2025-07-15",
      fechaDevolucion: "2025-07-30",
      devuelto: true,
    },
    {
      id: 4,
      titulo: "Los juegos del hambre",
      autor: "Suzanne Collins",
      genero: "Fantasía",
      fechaPrestamo: "2025-08-01",
      fechaDevolucion: null,
      devuelto: false,
    },
    {
      id: 5,
      titulo: "El principito",
      autor: "Antoine de Saint-Exupéry",
      genero: "Ficción",
      fechaPrestamo: "2025-05-20",
      fechaDevolucion: "2025-06-01",
      devuelto: true,
    },
  ];

  const colores = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  return (
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
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
        <div className="bg-white rounded-xl shadow-md p-6 min-h-[350px] w-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
      {/* Historial de préstamos */}
      <div className="w-full max-w-8xl mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Historial de Préstamos
        </h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Préstamo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Devolución
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historialPrestamos.map((prestamo) => (
                <tr key={prestamo.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prestamo.titulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prestamo.autor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prestamo.genero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(prestamo.fechaPrestamo).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prestamo.devuelto
                      ? new Date(prestamo.fechaDevolucion).toLocaleDateString()
                      : "Pendiente"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function User() {
  return (
    <ProtectedRoute>
      <PerfilUsuario />
    </ProtectedRoute>
  );
}
