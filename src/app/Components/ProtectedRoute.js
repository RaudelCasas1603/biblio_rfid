// components/ProtectedRoute.jsx
"use client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { usuario } = useAuth();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setChecking(false), 200);
  }, []);

  if (checking) return null;

  if (!usuario?.autenticado) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Acceso restringido
        </h2>
        <p className="text-gray-700 mb-4">
          Debes iniciar sesión para acceder a esta sección.
        </p>
        <a
          href="/Login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Iniciar sesión
        </a>
      </div>
    );
  }

  if (requireAdmin && usuario.rol !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">
          Permiso denegado
        </h2>
        <p className="text-gray-700 mb-4">
          Esta sección solo está disponible para administradores.
        </p>
        <a
          href="/"
          className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition">
          Ir al inicio
        </a>
      </div>
    );
  }

  return children;
}
