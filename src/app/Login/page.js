// app/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (correo === "admin@admin.com" && password === "admin") {
      login({ nombre: "Admin", correo, rol: "admin", autenticado: true });
      router.push("/Admin");
    } else {
      login({ nombre: "Usuario", correo, rol: "usuario", autenticado: true });
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          className="w-full border p-2 rounded"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Entrar
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/Signup" className="text-blue-600">
          Regístrate
        </a>
      </p>
    </div>
  );
}
