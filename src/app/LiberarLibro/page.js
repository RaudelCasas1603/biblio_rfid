"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function LiberarLibro() {
  const [status, setStatus] = useState("idle"); // idle | waiting | scanning | success | error
  const [mensaje, setMensaje] = useState("Listo para liberar.");
  const [libro, setLibro] = useState(null);

  // Catálogo ficticio para simular el mapeo de un tag NFC -> libro
  const catalogoSimulado = useMemo(
    () =>
      new Map([
        [
          "TAG-001",
          {
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            isbn: "978-0307474728",
          },
        ],
        [
          "TAG-002",
          {
            titulo: "El laberinto de la soledad",
            autor: "Octavio Paz",
            isbn: "978-9684115885",
          },
        ],
        [
          "TAG-003",
          {
            titulo: "Pedro Páramo",
            autor: "Juan Rulfo",
            isbn: "978-6070728798",
          },
        ],
        [
          "TAG-004",
          {
            titulo: "La sombra del viento",
            autor: "Carlos Ruiz Zafón",
            isbn: "978-8408172177",
          },
        ],
      ]),
    []
  );

  async function manejarLiberacion() {
    setLibro(null);
    setStatus("waiting");
    setMensaje('Pulsa "Escanear y liberar" y acerca el libro al sensor NFC...');
  }

  async function escanearNFC() {
    setStatus("scanning");
    setMensaje("Escaneando... acerca el libro al sensor NFC");

    // Intentamos leer NFC usando la API del navegador
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
            try {
              let tagId = "";
              for (const record of event.message.records) {
                if (record.recordType === "text") {
                  const textDecoder = new TextDecoder(
                    record.encoding || "utf-8"
                  );
                  tagId = textDecoder.decode(record.data);
                  break;
                }
                if (record.recordType === "url") {
                  const textDecoder = new TextDecoder("utf-8");
                  tagId = textDecoder.decode(record.data);
                  break;
                }
              }

              if (!tagId) {
                tagId = event.serialNumber || "TAG-003";
              }

              procesarTag(tagId);
              resolve();
            } catch (e) {
              setStatus("error");
              setMensaje("Ocurrió un error al procesar la etiqueta.");
              reject(e);
            }
          };
        });
        return; // Si llegamos aquí, ya procesamos
      }
    } catch (e) {
      // Ignoramos y usamos simulación abajo
    }

    // Simulación (fallback): elegimos un TAG al azar tras un pequeño delay
    await new Promise((r) => setTimeout(r, 1200));
    const tags = Array.from(catalogoSimulado.keys());
    const random = tags[Math.floor(Math.random() * tags.length)];
    procesarTag(random);
  }

  function procesarTag(tagId) {
    const base = catalogoSimulado.get(tagId) || catalogoSimulado.get("TAG-002");
    setLibro({
      id: tagId,
      titulo: base.titulo,
      autor: base.autor,
      isbn: base.isbn,
    });
    setStatus("success");
    setMensaje("Libro identificado. Puedes proceder a liberar.");
  }

  function confirmarLiberacion() {
    if (!libro) return;
    // Aquí iría la llamada real a tu backend para registrar la liberación
    // fetch('/api/liberar', { method: 'POST', body: JSON.stringify({ tag: libro.id }) })
    setMensaje(`Libro "${libro.titulo}" liberado correctamente.`);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Liberar Libro</h1>
          <p className="text-gray-600 mt-2">
            Presiona <span className="font-semibold">Escanear y liberar</span> y
            acerca el libro al sensor NFC.
          </p>
        </header>

        {/* Estado / Mensajes */}
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

        {/* Tarjeta de libro identificado */}
        {libro && (
          <div className="mb-4 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{libro.titulo}</h2>
                <p className="text-gray-600">{libro.autor}</p>
                <p className="text-gray-500 text-sm">ISBN: {libro.isbn}</p>
                <p className="text-gray-400 text-xs mt-1">Tag: {libro.id}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                Identificado
              </span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
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
            {status === "scanning" ? "Escaneando..." : "Escanear y liberar"}
          </button>

          <button
            onClick={confirmarLiberacion}
            disabled={!libro}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60">
            Confirmar liberación
          </button>
        </div>

        {/* Enlaces */}
        <div className="mt-6 text-center">
          <Link href="/Catalogo" className="text-blue-600 hover:underline">
            Volver al Catálogo
          </Link>
        </div>

        {/* Indicador visual cuando escanea */}
        {status === "scanning" && (
          <div className="mt-6 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}
