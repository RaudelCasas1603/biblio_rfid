"use client";
import { useState } from "react";
import Swal from "sweetalert2";

export default function RecibirLibro() {
  const [status, setStatus] = useState("idle");
  const [mensaje, setMensaje] = useState("Listo para recibir.");
  const [libro, setLibro] = useState(null);

  // Campos de verificación (admin)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [adminId, setAdminId] = useState(null);

  async function manejarRecepcion() {
    setLibro(null);
    setAuthChecked(false);
    setEmail("");
    setPassword("");
    setAdminId(null);
    setStatus("waiting");
    setMensaje('Pulsa "Escanear libro" y acerca el ejemplar al sensor NFC...');
  }

  async function escanearNFC() {
    setStatus("scanning");
    setMensaje("Escaneando etiqueta NFC...");

    try {
      if (typeof window !== "undefined" && "NDEFReader" in window) {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        await new Promise((resolve, reject) => {
          ndef.onreadingerror = () => {
            setStatus("error");
            setMensaje("No se pudo leer la etiqueta.");
            reject(new Error("NFC read error"));
          };
          ndef.onreading = () => {
            procesarTag();
            resolve();
          };
        });
        return;
      }
    } catch (e) {
      console.warn("NFC no disponible, usando fallback...");
    }

    // Fallback si no hay NFC
    await procesarTag();
  }

  async function procesarTag() {
    try {
      const res = await fetch(`http://localhost:1880/get_book_rfid`);
      if (!res.ok) throw new Error("Error al consultar el backend");

      const data = await res.json();

      // ✅ Si el libro ya está disponible, solo mostramos mensaje
      if (data.disponibilidad === true) {
        setLibro(null);
        setStatus("error");
        setMensaje(`El libro "${data.titulo}" ya está disponible en biblioteca.`);
        return;
      }

      // ✅ Caso normal: libro prestado → mostrar datos
      setLibro({
        id: data.id,
        pk_id_copia: data.pk_id_copia,
        rfid_tag: data.rfid_tag,
        disponibilidad: data.disponibilidad,
        titulo: data.titulo,
        autor: data.autor,
        isbn: data.isbn,
      });

      setStatus("success");
      setMensaje("Libro identificado. Ingrese credenciales de administrador.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMensaje("No se pudo obtener la información del libro.");
    }
  }

  async function verificarCredenciales() {
    if (!email || !password) {
      setMensaje("Ingrese correo y contraseña.");
      return;
    }

    try {
      const res = await fetch(
        `/api/usuario/validation_admin?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );

      if (res.status === 404) {
        // 🚨 Contraseña incorrecta
        Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
          text: "Por favor verifique sus credenciales.",
          confirmButtonColor: "#d33",
        });
        setAuthChecked(false);
        setAdminId(null);
        return;
      }

      if (!res.ok) {
        throw new Error("Error en la petición");
      }

      const data = await res.json();
      console.log("Respuesta validación admin:", data);

      if (data.verified === true) {
        setAuthChecked(true);
        setAdminId(data.id); // guardamos id del admin
        setMensaje("Administrador verificado. Puede confirmar la devolución.");
      } else {
        setAuthChecked(false);
        setAdminId(null);
        setMensaje("Credenciales incorrectas. Intente de nuevo.");
      }
    } catch (error) {
      console.error(error);
      setAuthChecked(false);
      setAdminId(null);
      setMensaje("Error al validar administrador.");
    }
  }

  async function confirmarRecepcion() {
    if (!libro || !authChecked || !adminId) return;

    try {
      const res = await fetch(
        `/api/copia_libro/stat_copia_libro_devuelto/${libro.pk_id_copia}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Error al actualizar estatus de copia");

      const data = await res.json();
      console.log("Respuesta devolución:", data);

      Swal.fire({
        title: "Devolución registrada",
        text: `El libro "${libro.titulo}" fue devuelto correctamente.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        timer: 2000,
      }).then(() => {
        setLibro(null);
        setEmail("");
        setPassword("");
        setAuthChecked(false);
        setAdminId(null);
        setStatus("idle");
        setMensaje("Listo para recibir.");
      });
    } catch (error) {
      console.error("Error al registrar devolución:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo registrar la devolución.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-2 mb-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recepción de libros
      </h2>
      <p className="text-gray-600 mb-4">{mensaje}</p>

      {libro && (
        <div className="mb-4 border p-3 rounded-lg">
          <h3 className="font-semibold">{libro.titulo}</h3>
          <p className="text-sm text-gray-600">{libro.autor}</p>
          <p className="text-sm text-gray-500">ISBN: {libro.isbn}</p>
          <p className="text-xs text-gray-400">Tag: {libro.rfid_tag}</p>
        </div>
      )}

      {/* Formulario de verificación admin */}
      {libro && !authChecked && (
        <div className="mb-4 border rounded-xl p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Verificación de administrador</h3>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded-md"
          />
          <button
            onClick={verificarCredenciales}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Verificar
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={manejarRecepcion}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Preparar recepción
        </button>
        <button
          onClick={escanearNFC}
          disabled={status === "scanning"}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "scanning" ? "Escaneando..." : "Escanear libro"}
        </button>
        <button
          onClick={confirmarRecepcion}
          disabled={!libro || !authChecked}
          className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Confirmar devolución
        </button>
      </div>

      {status === "scanning" && (
        <div className="mt-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      )}
    </div>
  );
}
