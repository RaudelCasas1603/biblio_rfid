"use client";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faBook,
  faTag,
  faBarcode,
  faQrcode,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

// ---- COMPONENTES REUTILIZABLES ----
function Field({ label, icon, type = "text", value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && " *"}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={icon} className="text-gray-400" />
        </span>
        <input
          type={type}
          className="w-full border rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

// ---- COMPONENTE PRINCIPAL ----
export default function AdminCopias() {
  const [query, setQuery] = useState("");
  const [copias, setCopias] = useState([]);
  const [libros, setLibros] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    fk_id_libro: "",
    isbn: "",
    rfid_tag: "",
    disponibilidad: true,
  });

  // 🔄 Cargar copias y libros
  useEffect(() => {
    async function fetchData() {
      try {
        const resCopias = await fetch("/api/copia_libro/get_all_copies/");
        const dataCopias = await resCopias.json();
        setCopias(dataCopias || []);

        const resLibros = await fetch("/api/libro/get_all/");
        const dataLibros = await resLibros.json();
        setLibros(dataLibros || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    }
    fetchData();
  }, []);

  // 🔎 Filtro de búsqueda
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return copias;
    return copias.filter((c) => {
      const autor = c.libro?.autor?.toLowerCase() || "";
      const titulo = c.libro?.titulo?.toLowerCase() || "";
      const isbn = c.isbn?.toLowerCase() || "";
      const rfid = c.rfid_tag?.toLowerCase() || "";
      return autor.includes(q) || titulo.includes(q) || isbn.includes(q) || rfid.includes(q);
    });
  }, [copias, query]);

  // 🆕 Crear
  const openCreate = () => {
    setEditing(null);
    setForm({
      fk_id_libro: libros.length > 0 ? libros[0].id : "",
      isbn: "",
      rfid_tag: "",
      disponibilidad: true,
    });
    setModalOpen(true);
  };

  // ✏️ Editar
  const openEdit = (copia) => {
    setEditing(copia);
    setForm({
      fk_id_libro: copia.fk_id_libro,
      isbn: copia.isbn,
      rfid_tag: copia.rfid_tag,
      disponibilidad: copia.disponibilidad,
    });
    setModalOpen(true);
  };

  // ❌ Eliminar
  const handleDelete = async (copia) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Eliminar copia",
      text: `¿Seguro que deseas eliminar la copia de "${copia.libro.titulo}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;
    try {
      const response = await fetch(`/api/copia_libro/delete/${copia.pk_id_copia}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar copia");
      Swal.fire({ icon: "success", title: "Eliminada", timer: 1400, showConfirmButton: false })
        .then(() => window.location.reload());
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar la copia" });
    }
  };

  // Obtener nuevo ID copia
  const obtenerNuevoId = async () => {
    try {
      const res = await fetch("/api/copia_libro/ultimo_id_copia/");
      const lastId = await res.json();
      return lastId + 1;
    } catch (err) {
      console.error("Error obteniendo último id copia:", err);
    }
  };

  // Guardar (CREATE / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.isbn || !form.rfid_tag) {
      Swal.fire({ icon: "warning", title: "Campos requeridos", text: "ISBN y RFID son obligatorios" });
      return;
    }

    if (editing) {
      const copiaEditada = {
        id: editing.id,
        pk_id_copia: editing.pk_id_copia,
        fk_id_libro: form.fk_id_libro,
        isbn: form.isbn,
        rfid_tag: form.rfid_tag,
        disponibilidad: form.disponibilidad,
        created_at: editing.created_at,
        updated_at: new Date().toISOString(),
      };
      try {
        const res = await fetch("/api/copia_libro/update/", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(copiaEditada),
        });
        if (!res.ok) throw new Error();
        await res.json();
        Swal.fire({ icon: "success", title: "Copia actualizada", timer: 1400, showConfirmButton: false })
          .then(() => window.location.reload());
      } catch {
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar la copia" });
      }
    } else {
      const nuevoId = await obtenerNuevoId();
      const nuevaCopia = {
        id: "",
        pk_id_copia: nuevoId,
        fk_id_libro: form.fk_id_libro,
        isbn: form.isbn,
        rfid_tag: form.rfid_tag,
        disponibilidad: form.disponibilidad,
        created_at: "",
        updated_at: "",
      };
      console.log(JSON.stringify(nuevaCopia))
      try {
        const res = await fetch("/api/copia_libro/create/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaCopia),
        });
        if (!res.ok) throw new Error();
        await res.json();
        Swal.fire({ icon: "success", title: "Copia agregada", timer: 1400, showConfirmButton: false })
          .then(() => window.location.reload());
      } catch {
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar la copia" });
      }
    }
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Copias</h1>
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <FontAwesomeIcon icon={faPlus} /> Nueva copia
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
            </span>
            <input
              className="w-full bg-white border rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Buscar por título, autor, ISBN o RFID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Portada</th>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">ISBN</th>
                  <th className="px-4 py-3">RFID</th>
                  <th className="px-4 py-3">Disponibilidad</th>
                  <th className="px-4 py-3 w-56">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No hay resultados.</td>
                  </tr>
                )}
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={c.libro?.ruta_img} alt={c.libro?.titulo} className="h-16 w-12 object-cover rounded border" />
                    </td>
                    <td className="px-4 py-3">{c.libro?.titulo}</td>
                    <td className="px-4 py-3">{c.libro?.autor}</td>
                    <td className="px-4 py-3">{c.isbn}</td>
                    <td className="px-4 py-3">{c.rfid_tag}</td>
                    <td className="px-4 py-3">{c.disponibilidad ? "Disponible" : "Ocupada"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(c)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600">
                        <FontAwesomeIcon icon={faPenToSquare} /> Editar
                      </button>
                      <button onClick={() => handleDelete(c)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700">
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">{editing ? "Editar copia" : "Nueva copia"}</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                
                {/* Selección de libro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libro</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.fk_id_libro}
                    onChange={(e) => setForm((f) => ({ ...f, fk_id_libro: e.target.value }))}
                  >
                    {libros.map((lib) => (
                      <option key={lib.id} value={lib.id}>
                        {lib.titulo} – {lib.autor} ({new Date(lib.fecha_publicacion).getFullYear()})
                      </option>
                    ))}
                  </select>
                </div>

                <Field icon={faBook} label="ISBN" value={form.isbn} onChange={(v) => setForm((f) => ({ ...f, isbn: v }))} placeholder="978-0-321-76572-3" required />
                <Field icon={faQrcode} label="RFID Tag" value={form.rfid_tag} onChange={(v) => setForm((f) => ({ ...f, rfid_tag: v }))} placeholder="0000000001" required />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={form.disponibilidad}
                    onChange={(e) => setForm((f) => ({ ...f, disponibilidad: e.target.value === "true" }))}
                  >
                    <option value="true">Disponible</option>
                    <option value="false">Ocupada</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    {editing ? "Guardar cambios" : "Agregar copia"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
