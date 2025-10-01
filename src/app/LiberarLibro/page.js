"use client";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function LiberarLibro() {
  const [status, setStatus] = useState("idle"); // idle | waiting | scanning | success | error
  const [mensaje, setMensaje] = useState("Listo para liberar.");
  const [libro, setLibro] = useState(null);

  // Campos de verificación
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState(null); // id del usuario validado

  async function manejarLiberacion() {
    setLibro(null);
    setAuthChecked(false);
    setEmail("");
    setPassword("");
    setUserId(null);
    setStatus("waiting");
    setMensaje('Pulsa "Escanear y liberar" y acerca el libro al sensor NFC...');
  }

  async function escanearNFC() {
    setStatus("scanning");
    setMensaje("Escaneando... acerca el libro al sensor NFC");

    try {
      if (typeof window !== "undefined" && "NDEFReader" in window) {
        const ndef = new window.NDEFReader();
        await ndef.scan();
        setMensaje("Leyendo etiqueta NFC...");

        await new Promise((resolve, reject) => {
          ndef.onreadingerror = () => {
            setStatus("error");
            setMensaje("No se pudo leer la etiqueta. Intenta de nuevo.");
            reject(new Error("NFC read error"));
          };
          ndef.onreading = (event) => {
            let tagId = event.serialNumber || "0000000001";
            procesarTag(tagId);
            resolve();
          };
        });
        return;
      }
    } catch (e) {
      // fallback de simulación
    }

    // Simulación si no hay NFC
    await new Promise((r) => setTimeout(r, 1200));
    procesarTag("0000000001");
  }

  async function procesarTag(tagId) {
    try {
      const res = await fetch(`http://localhost:1880/get_book_rfid`);
      if (!res.ok) throw new Error("Error al consultar el backend");

      const data = await res.json();

      if(data.disponibilidad){
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
        setMensaje("Libro identificado. Ingrese sus credenciales para liberar.");
      }else{
        setStatus("error");
        setMensaje("Libro identificado pero no disponible para su prestamo, consulte al bibliotecario.");
      }

      
    } catch (error) {
      console.error(error);
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
        `/api/usuario/validation?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );

      if (!res.ok) {
        throw new Error("Error en la petición");
      }

      const data = await res.json();
      console.log("Respuesta validación:", data);

      if (data.verified === true) {
        setAuthChecked(true);
        setUserId(data.id); // guardamos id del usuario autenticado
        setMensaje("Usuario verificado. Puede confirmar la liberación.");
      } else {
        setAuthChecked(false);
        setUserId(null);
        setMensaje("Credenciales incorrectas. Intente de nuevo.");
      }
    } catch (error) {
      console.error(error);
      setAuthChecked(false);
      setUserId(null);
      setMensaje("Error al validar el usuario.");
    }
  }

  // 🔧 helper para quitar la Z de ISOString
  function toIsoNoZ(date) {
    return date.toISOString().replace("Z", "");
  }

async function confirmarLiberacion() {
  if (!libro || !authChecked || !userId) return;

  try {
    // id 
    const res_last_prestamo = await fetch(`/api/prestamo/ultimo_prestamo_id/`);
    if (!res_last_prestamo.ok) throw new Error("Error al consultar el backend");

    const data_last_prestamo = await res_last_prestamo.json();
    // asegúrate de convertir a número
    const nuevoIdPrestamo = Number(data_last_prestamo) + 1;
    
    // fechas
    const fechaPrestamo = new Date();
    const fechaEntrega = new Date();
    fechaEntrega.setMonth(fechaPrestamo.getMonth() + 1);

    // diferencia en días
    const diffMs = fechaEntrega - fechaPrestamo;
    const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // payload con el formato correcto
    const prestamoPayload = {
      id: "",
      pk_id_prestamo: nuevoIdPrestamo, 
      fk_id_copia: libro.id, 
      fk_id_usuario: userId, 
      fecha_prestamo: fechaPrestamo.toISOString(),
      fecha_entrega: fechaEntrega.toISOString(),
      dias_restantes: diasRestantes,
      estatus_entrega: false, 
      created_at: fechaPrestamo.toISOString(),
      updated_at: fechaPrestamo.toISOString(),
    };

    console.log("Enviando payload:", prestamoPayload);

    const res = await fetch("/api/prestamo/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prestamoPayload),
    });

    if (!res.ok) throw new Error("Error en creación de préstamo");

    const data = await res.json();
    console.log("Respuesta API:", data);

    // enviar actualizacion de libro
    const res_update_libro_copy = await fetch(`/api/copia_libro/stat_copia_libro_prestado/${libro.pk_id_copia}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res_update_libro_copy.ok) throw new Error("Error en creación de préstamo");

    const data_update_libro_copy = await res_update_libro_copy.json();
    console.log("Respuesta API:", data_update_libro_copy);

    Swal.fire({
      title: "¡Liberación exitosa!",
      text: `El libro "${libro.titulo}" fue liberado correctamente.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      setLibro(null);
      setEmail("");
      setPassword("");
      setAuthChecked(false);
      setUserId(null);
      setStatus("idle");
      setMensaje("Listo para liberar.");
    });
  } catch (error) {
    console.error("Error creando préstamo:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudo registrar el préstamo.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
}

 

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Liberar Libro</h1>
          <p className="text-gray-600 mt-2">
            Escanea el libro con NFC y valida tus credenciales.
          </p>
        </header>

        {/* Estado */}
        <div
          className={`mb-4 rounded-lg border p-3 text-sm ${
            status === "error"
              ? "border-red-300 bg-red-50 text-red-700"
              : status === "success"
              ? "border-green-300 bg-green-50 text-green-700"
              : status === "scanning"
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-gray-50 text-gray-700"
          }`}>
          {mensaje}
        </div>

        {/* Tarjeta del libro */}
        {libro && (
          <div className="mb-4 rounded-xl border border-gray-200 p-4">
            <h2 className="text-xl font-semibold">{libro.titulo}</h2>
            <p className="text-gray-600">{libro.autor}</p>
            <p className="text-gray-500 text-sm">ISBN: {libro.isbn}</p>
            <p className="text-gray-400 text-xs mt-1">Tag: {libro.rfid_tag}</p>
          </div>
        )}

        {/* Formulario de verificación */}
        {libro && !authChecked && (
          <div className="mb-4 border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Verificación de usuario</h3>
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
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Verificar
            </button>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={manejarLiberacion}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">
            Preparar liberación
          </button>

          <button
            onClick={escanearNFC}
            disabled={status === "scanning"}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {status === "scanning" ? "Escaneando..." : "Escanear NFC"}
          </button>

          <button
            onClick={confirmarLiberacion}
            disabled={!libro || !authChecked}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
            Confirmar liberación
          </button>
        </div>

        {/* Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al Catálogo
          </Link>
        </div>

        {status === "scanning" && (
          <div className="mt-6 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}
