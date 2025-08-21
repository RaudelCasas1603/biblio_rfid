// app/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swal from "sweetalert2";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (correo === "admin@admin.com" && password === "admin") {
      login({ nombre: "Admin", correo, rol: "admin", autenticado: true });

      Swal.fire({
        icon: "success",
        title: "Bienvenido Admin",
        text: "Has iniciado sesión correctamente",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push("/Admin");
      });
    } else if (correo && password) {
      login({ nombre: "Usuario", correo, rol: "usuario", autenticado: true });

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Inicio de sesión exitoso",
        timer: 2000,
        showConfirmButton: true,
      }).then(() => {
        router.push("/");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Correo o contraseña incorrectos",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>

      <img
        src="profile.webp"
        alt="Imagen Perfil"
        className="rounded-full border-black border-1 w-30 h-30 mx-auto mb-6"
      />

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="flex display-inline items-center mb-4 space-x-4">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-500  fa-2x" />
          <input
            type="email"
            placeholder="Correo"
            className="w-full border p-2 rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="flex display-inline items-center mb-4 space-x-4">
          <FontAwesomeIcon icon={faKey} className="text-gray-500 fa-2x" />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="bg-blue-700 text-white w-full py-2 rounded hover:bg-blue-400 transition-colors duration-500">
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
