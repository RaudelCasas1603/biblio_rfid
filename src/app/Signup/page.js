"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

import { faEnvelope, faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SignUpPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSignUp = (e) => {
    e.preventDefault();
    login({ nombre, correo, rol: "usuario", autenticado: true });
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h1>
      <img
        src="profile.webp"
        alt="Imagen Perfil "
        className="rounded-full w-30 h-30 border-black border-1 mx-auto mb-6"
      />
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="flex display-inline items-center mb-4 space-x-4">
          <FontAwesomeIcon icon={faUser} className="text-gray-500 fa-xl" />
          <input
            type="text"
            placeholder="Nombre"
            className="w-full border p-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="flex display-inline items-center mb-4 space-x-4">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 fa-xl" />
          <input
            type="email"
            placeholder="Correo"
            className="w-full border p-2 rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="flex display-inline items-center mb-4 space-x-4">
          <FontAwesomeIcon icon={faKey} className="text-gray-500 fa-xl" />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="bg-green-700 text-white w-full py-2 rounded hover:bg-green-400 transition-colors duration-500">
          Registrarse
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        ¿Ya tienes cuenta?{" "}
        <a href="/Login" className="text-blue-600">
          Inicia sesión
        </a>
      </p>
    </div>
  );
}
