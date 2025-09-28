"use client";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";

export default function RecibirLibro() {
  const [status, setStatus] = useState("idle");
  const [mensaje, setMensaje] = useState("Listo para recibir.");
  const [libro, setLibro] = useState(null);

  // Catálogo simulado
  const catalogoSimulado = useMemo(
    () =>
      new Map([
        [
          "TAG-001",
          { titulo: "Cien años de soledad", autor: "Gabriel García Márquez" },
        ],
        [
          "TAG-002",
          { titulo: "El laberinto de la soledad", autor: "Octavio Paz" },
        ],
        ["TAG-003", { titulo: "Pedro Páramo", autor: "Juan Rulfo" }],
        [
          "TAG-004",
          { titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón" },
        ],
      ]),
    []
  );

  async function manejarRecepcion() {
    setLibro(null);
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
          ndef.onreading = (event) => {
            const tagId = event.serialNumber || "TAG-002";
            procesarTag(tagId);
            resolve();
          };
        });
        return;
      }
    } catch (e) {
      // fallback
    }

    // Simulación
    await new Promise((r) => setTimeout(r, 1200));
    const tags = Array.from(catalogoSimulado.keys());
    const random = tags[Math.floor(Math.random() * tags.length)];
    procesarTag(random);
  }

  function procesarTag(tagId) {
    const base = catalogoSimulado.get(tagId) || { titulo: "Desconocido" };
    setLibro({ id: tagId, ...base });
    setStatus("success");
    setMensaje("Libro identificado. Puede confirmar la devolución.");
  }

  function confirmarRecepcion() {
    if (!libro) return;

    // 🔥 Aquí debería ir fetch a tu API real, ejemplo:
    // fetch("/api/prestamo/devolver", { method: "POST", body: JSON.stringify({ tag: libro.id }) });

    Swal.fire({
      title: "Devolución registrada",
      text: `El libro "${libro.titulo}" fue devuelto correctamente.`,
      icon: "success",
      confirmButtonColor: "#3085d6",
      timer: 2000,
    }).then(() => {
      // limpiar
      setLibro(null);
      setStatus("idle");
      setMensaje("Listo para recibir.");
    });
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
          <p className="text-xs text-gray-400">Tag: {libro.id}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={manejarRecepcion}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
          Preparar recepción
        </button>
        <button
          onClick={escanearNFC}
          disabled={status === "scanning"}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {status === "scanning" ? "Escaneando..." : "Escanear libro"}
        </button>
        <button
          onClick={confirmarRecepcion}
          disabled={!libro}
          className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
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
