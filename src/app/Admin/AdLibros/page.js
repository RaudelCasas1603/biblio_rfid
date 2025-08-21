"use client";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faBook,
  faBarcode,
  faUser,
  faCalendar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminBooks() {
  const [query, setQuery] = useState("");

  // Datos de ejemplo (puedes iniciar con [] si lo prefieres)
  const [books, setBooks] = useState([
    {
      id: 1,
      titulo: "Cien años de soledad",
      autor: "G. García Márquez",
      isbn: "9780307474728",
      anio: 1967,
      estado: "disponible",
      imagen: "",
    },
    {
      id: 2,
      titulo: "El laberinto de la soledad",
      autor: "Octavio Paz",
      isbn: "9788437603139",
      anio: 1950,
      estado: "prestado",
      imagen: "",
    },
    {
      id: 3,
      titulo: "Pedro Páramo",
      autor: "Juan Rulfo",
      isbn: "9786071608908",
      anio: 1955,
      estado: "disponible",
      imagen: "/Portadas_Libros/pedro_paramo.webp",
    },
  ]);

  // Estado del modal y del formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // libro en edición o null
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    anio: "",
    estado: "disponible",
    imagen: "",
  });

  // Filtrado
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.titulo.toLowerCase().includes(q) ||
        b.autor.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        String(b.anio).includes(q) ||
        b.estado.toLowerCase().includes(q)
    );
  }, [books, query]);

  // Abrir modal en modo crear
  const openCreate = () => {
    setEditing(null);
    setForm({
      titulo: "",
      autor: "",
      isbn: "",
      anio: "",
      estado: "disponible",
      imagen: "",
    });
    setModalOpen(true);
  };

  // Abrir modal en modo edición
  const openEdit = (book) => {
    setEditing(book);
    setForm({ ...book, anio: book.anio || "" });
    setModalOpen(true);
  };

  // Eliminar libro con confirmación
  const handleDelete = async (book) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Eliminar libro",
      text: `¿Seguro que deseas eliminar "${book.titulo}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        timer: 1400,
        showConfirmButton: false,
      });
    }
  };

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!form.titulo || !form.autor || !form.isbn) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Título, Autor e ISBN son obligatorios",
      });
      return;
    }

    if (editing) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editing.id
            ? { ...editing, ...form, anio: Number(form.anio) || "" }
            : b
        )
      );
      Swal.fire({
        icon: "success",
        title: "Libro actualizado",
        timer: 1400,
        showConfirmButton: false,
      });
    } else {
      const nuevo = {
        id: Math.max(0, ...books.map((b) => b.id)) + 1,
        ...form,
        anio: Number(form.anio) || "",
      };
      setBooks((prev) => [nuevo, ...prev]);
      Swal.fire({
        icon: "success",
        title: "Libro agregado",
        timer: 1400,
        showConfirmButton: false,
      });
    }
    setModalOpen(false);
  };

  // Badge de estado
  const badge = (estado) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        estado === "disponible"
          ? "bg-green-100 text-green-700"
          : estado === "prestado"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
      }`}>
      {estado}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Libros
          </h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <FontAwesomeIcon icon={faPlus} />
            Nuevo libro
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Aquí puedes agregar, editar o eliminar libros del catálogo.
        </p>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-gray-400"
              />
            </span>
            <input
              className="w-full bg-white border rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Buscar por título, autor, ISBN, año o estado..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Portada</th>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">ISBN</th>
                  <th className="px-4 py-3">Año</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 w-40">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500">
                      No hay resultados.
                    </td>
                  </tr>
                )}
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {b.imagen ? (
                        <img
                          src={b.imagen}
                          alt={b.titulo}
                          className="h-16 w-12 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Sin imagen
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{b.titulo}</td>
                    <td className="px-4 py-3">{b.autor}</td>
                    <td className="px-4 py-3">{b.isbn}</td>
                    <td className="px-4 py-3">{b.anio}</td>
                    <td className="px-4 py-3">{badge(b.estado)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(b)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                          title="Editar">
                          <FontAwesomeIcon icon={faPenToSquare} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                          title="Eliminar">
                          <FontAwesomeIcon icon={faTrash} />
                          Eliminar
                        </button>
                      </div>
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
                <h3 className="text-lg font-semibold">
                  {editing ? "Editar libro" : "Nuevo libro"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Cerrar">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <Field
                  icon={faBook}
                  label="Título"
                  value={form.titulo}
                  onChange={(v) => setForm((f) => ({ ...f, titulo: v }))}
                  placeholder="Ej. Rayuela"
                  required
                />
                <Field
                  icon={faUser}
                  label="Autor"
                  value={form.autor}
                  onChange={(v) => setForm((f) => ({ ...f, autor: v }))}
                  placeholder="Ej. Julio Cortázar"
                  required
                />
                <Field
                  icon={faBarcode}
                  label="ISBN"
                  value={form.isbn}
                  onChange={(v) => setForm((f) => ({ ...f, isbn: v }))}
                  placeholder="Ej. 9780141187934"
                  required
                />
                <Field
                  icon={faCalendar}
                  label="Año"
                  type="number"
                  value={form.anio}
                  onChange={(v) => setForm((f) => ({ ...f, anio: v }))}
                  placeholder="Ej. 1963"
                />

                {/* Campo de imagen con vista previa */}
                <FieldImage
                  label="Portada"
                  value={form.imagen}
                  onChange={(v) => setForm((f) => ({ ...f, imagen: v }))}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FontAwesomeIcon
                      icon={faTag}
                      className="mr-2 text-gray-400"
                    />
                    Estado
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.estado}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, estado: e.target.value }))
                    }>
                    <option value="disponible">disponible</option>
                    <option value="prestado">prestado</option>
                    <option value="mantenimiento">mantenimiento</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    {editing ? "Guardar cambios" : "Agregar libro"}
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

/** ---------- Componentes auxiliares ---------- */
function Field({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && " *"}
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

/**
 * Campo de imagen con vista previa (Base64 en memoria)
 * Para demo/local está perfecto. En producción,
 * sube el archivo a un bucket (Cloudinary/S3/Firebase) y guarda la URL.
 */
function FieldImage({ label, value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones básicas
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no válido",
        text: "Solo se aceptan imágenes JPEG, PNG o WEBP.",
      });
      return;
    }
    const maxMB = 2;
    if (file.size > maxMB * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Archivo muy grande",
        text: `La imagen debe pesar menos de ${maxMB} MB.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result); // Base64
    reader.readAsDataURL(file);
  };

  const clearImage = () => onChange("");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="w-full border rounded-lg px-3 py-2"
      />

      {value && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={value}
            alt="Vista previa"
            className="h-32 w-24 object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={clearImage}
            className="px-3 py-2 rounded-lg border hover:bg-gray-50">
            Quitar imagen
          </button>
        </div>
      )}
    </div>
  );
}
