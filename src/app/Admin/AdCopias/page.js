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
  faBarcode,
  faUser,
  faCalendar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

// Field, FieldSelect, FieldImage componentes siguen siendo los mismos


/**
 * Campo de imagen con vista previa (Base64 en memoria)
 * Para demo/local está perfecto. En producción,
 * sube el archivo a un bucket (Cloudinary/S3/Firebase) y guarda la URL.
 */
// Componente para los campos de entrada de texto (como Título, Autor, etc.)
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

// Componente para los campos de selección (como Departamento, Género, etc.)
function FieldSelect({ label, icon, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={icon} className="text-gray-400" />
        </span>
        <select
          className="w-full border rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Componente para cargar y mostrar imágenes (como la portada del libro)
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
            className="px-3 py-2 rounded-lg border hover:bg-gray-50"
          >
            Quitar imagen
          </button>
        </div>
      )}
    </div>
  );
}


export default function AdminBooks() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [tiposGenero, setTiposGenero] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // libro en edición o null
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    anio: "",
    estado: "disponible",
    imagen: "",
    copias: 0,
    fk_id_departamento: "", // Deberemos llenar con la opción seleccionada
    fk_id_genero: "", // Deberemos llenar con la opción seleccionada
  });

  // 🔄 Cargar libros, géneros y departamentos al montar
  useEffect(() => {
    async function fetchData() {
      try {
        const resLibros = await fetch("/api/libro/get/all");
        const librosData = await resLibros.json();
        setBooks(librosData);

        const resDepartamentos = await fetch("/api/departamento");
        const departamentosData = await resDepartamentos.json();
        setDepartamentos(departamentosData);

        const resGeneros = await fetch("/api/generos");
        const generosData = await resGeneros.json();
        setTiposGenero(generosData);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    }

    fetchData();
  }, []);

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

  const openCreate = () => {
    setEditing(null);
    setForm({
      titulo: "",
      autor: "",
      isbn: "",
      anio: "",
      estado: "disponible",
      imagen: "",
      copias: 0,
      fk_id_departamento: departamentos.length > 0 ? departamentos[0].id : "",
      fk_id_genero: tiposGenero.length > 0 ? tiposGenero[0].id : "",
    });
    setModalOpen(true);
  };

  const openEdit = (book) => {
    setEditing(book);
    setForm({ ...book, anio: book.anio || "", copias: book.copias || 0 });
    setModalOpen(true);
  };

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

  // Función para obtener el último ID de libro y sumarle 1
  const obtenerNuevoId = async () => {
    try {
      const res = await fetch("/api/libro/ultimo_libro_id/");
      const lastId = await res.json();
      return lastId + 1;
    } catch (err) {
      console.error("Error al obtener último ID de libro:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.autor || !form.isbn) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Título, Autor e ISBN son obligatorios",
      });
      return;
    }

    // Validar si el año es un número
    if (isNaN(form.anio)) {
      Swal.fire({
        icon: "error",
        title: "Año no válido",
        text: "El año debe ser un número válido",
      });
      return;
    }

    // Si estamos editando un libro
    if (editing) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editing.id ? { ...editing, ...form } : b
        )
      );
      Swal.fire({
        icon: "success",
        title: "Libro actualizado",
        timer: 1400,
        showConfirmButton: false,
      });
    } else {
      // Obtener nuevo id de libro
      const nuevoId = await obtenerNuevoId();

      const nuevoLibro = {
        id: "", // Este campo lo maneja el backend
        pk_id_libro: nuevoId,
        ...form,
        fecha_publicacion: new Date().toISOString(),
        created_at: "",
        updated_at: "",
      };

      // Hacer el POST a la API
      try {
        const res = await fetch("/api/libro/create/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoLibro),
        });

        if (!res.ok) throw new Error("Error al crear libro");

        const data = await res.json();
        setBooks((prev) => [data, ...prev]);

        Swal.fire({
          icon: "success",
          title: "Libro agregado",
          timer: 1400,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error al crear libro:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo agregar el libro",
        });
      }
    }

    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Libros</h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nuevo libro
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
                  <th className="px-4 py-3 w-56">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={`/Portadas_Libros/${b.ruta_img}`}
                        alt={b.titulo}
                        className="h-16 w-12 object-cover rounded border"
                      />
                    </td>
                    <td className="px-4 py-3">{b.titulo}</td>
                    <td className="px-4 py-3">{b.autor}</td>
                    <td className="px-4 py-3">{b.isbn}</td>
                    <td className="px-4 py-3">{b.anio}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          b.estado === "disponible"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(b)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                        >
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
                  aria-label="Cerrar"
                >
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

                <FieldImage
                  label="Portada"
                  value={form.imagen}
                  onChange={(v) => setForm((f) => ({ ...f, imagen: v }))}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FontAwesomeIcon icon={faTag} className="mr-2 text-gray-400" />
                    Estado
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.estado}
                    onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                  >
                    <option value="disponible">disponible</option>
                    <option value="prestado">prestado</option>
                    <option value="mantenimiento">mantenimiento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.fk_id_departamento}
                    onChange={(e) => setForm((f) => ({ ...f, fk_id_departamento: e.target.value }))}
                  >
                    {departamentos.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.fk_id_genero}
                    onChange={(e) => setForm((f) => ({ ...f, fk_id_genero: e.target.value }))}
                  >
                    {tiposGenero.map((gen) => (
                      <option key={gen.id} value={gen.id}>
                        {gen.genero}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
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

