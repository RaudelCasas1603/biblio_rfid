// components/ProtectedRoute.jsx
"use client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { usuario } = useAuth();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulación de carga de contexto
    const t = setTimeout(() => setChecking(false), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (checking) return;

    if (!usuario?.autenticado) {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Debes iniciar sesión para acceder a esta sección.",
        confirmButtonText: "Ir a iniciar sesión",
      }).then(() => router.replace("/Login"));
    } else if (requireAdmin && usuario.rol !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Permiso denegado",
        text: "Esta sección solo está disponible para administradores.",
        confirmButtonText: "Volver al inicio",
      }).then(() => router.replace("/"));
    }
  }, [checking, usuario, requireAdmin, router]);

  if (checking) return null;

  // Render “fallback” por si desactivas los modales o el usuario cierra el modal sin redirigir
  if (!usuario?.autenticado) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16"></div>
    );
  }

  if (requireAdmin && usuario.rol !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16">
        ¿
      </div>
    );
  }

  return children;
}
