"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function User() {
  const user = {
    nombre: "Marcella Ordaz",
    correo: "marcella@example.com",
    rol: "Administradora",
    fechaRegistro: "2024-03-14",
    avatar: "/profile.webp",
  };

  const prestamosTotales = 45; // Example total loans

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

  return (
    <div className="flex flex-col items-center w-full px-4 pt-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-8">
        Perfil de Usuario
      </h1>

      {/* Tarjeta de perfil */}
      <div className="bg-white rounded-xl shadow-lg px-8 py-6 max-w-sm w-full text-center">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 shadow-md border-2 border-blue-200"
        />
        <h2 className="text-xl font-semibold text-gray-800">{user.nombre}</h2>
        <p className="text-sm text-gray-500">{user.correo}</p>

        <div className="text-sm text-gray-700 text-left mt-4 space-y-1">
          <p>
            <span className="font-semibold">Rol:</span> {user.rol}
          </p>
          <p>
            <span className="font-semibold">Miembro desde:</span>{" "}
            {new Date(user.fechaRegistro).toLocaleDateString("es-MX")}
          </p>
        </div>

        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition shadow-md">
          Editar perfil
        </button>
      </div>

      {/* Estadísticas */}
      <div className="w-full max-w-4xl mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contador */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center min-h-[250px] w-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Libros prestados
          </h3>
          <p className="text-4xl font-bold text-blue-600">{prestamosTotales}</p>
          <p className="text-sm text-gray-500">en total</p>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow-md p-6 min-h-[250px] w-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Préstamos mensuales
          </h3>
          <ResponsiveContainer width="100%" height={160}>
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
  );
}
