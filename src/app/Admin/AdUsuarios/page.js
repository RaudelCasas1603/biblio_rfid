// app/Admin/Users/page.jsx
"use client";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faUser,
  faEnvelope,
  faShieldHalved,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminUsers() {
  const [query, setQuery] = useState("");

  // Datos de ejemplo (puedes iniciar con [] si gustas)
  const [users, setUsers] = useState([
    {
      id: 1,
      nombre: "Admin",
      correo: "admin@admin.com",
      rol: "admin",
      estado: "activo",
      avatar: "/profile.webp",
    },
    {
      id: 2,
      nombre: "María López",
      correo: "maria@example.com",
      rol: "usuario",
      estado: "activo",
      avatar: "/profile.webp",
    },
    {
      id: 3,
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      rol: "usuario",
      estado: "bloqueado",
      avatar: "",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "usuario",
    estado: "activo",
    avatar: "",
    password: "",
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) ||
        u.correo.toLowerCase().includes(q) ||
        u.rol.toLowerCase().includes(q) ||
        u.estado.toLowerCase().includes(q)
    );
  }, [users, query]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nombre: "",
      correo: "",
      rol: "usuario",
      estado: "activo",
      avatar: "",
      password: "",
    });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({ ...user, password: "" }); // no mostramos/guardamos password actual
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Eliminar usuario",
      text: `¿Seguro que deseas eliminar a "${user.nombre}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        timer: 1400,
        showConfirmButton: false,
      });
    }
  };

  // Bloquear/activar rápido desde tabla
  const toggleEstado = async (user) => {
    const nuevoEstado = user.estado === "activo" ? "bloqueado" : "activo";
    const res = await Swal.fire({
      icon: "question",
      title: `Cambiar estado`,
      text: `¿Deseas cambiar el estado de ${user.nombre} a "${nuevoEstado}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, estado: nuevoEstado } : u))
      );
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Nombre y correo son obligatorios",
      });
      return;
    }
    if (!emailValido(form.correo)) {
      Swal.fire({
        icon: "error",
        title: "Correo no válido",
        text: "Verifica el formato del correo",
      });
      return;
    }
    if (!editing && !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña requerida",
        text: "Para crear un usuario nuevo, especifica una contraseña",
      });
      return;
    }

    if (editing) {
      // Actualizar
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id
            ? {
                ...editing,
                nombre: form.nombre,
                correo: form.correo,
                rol: form.rol,
                estado: form.estado,
                avatar: form.avatar,
              }
            : u
        )
      );
      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        timer: 1400,
        showConfirmButton: false,
      });
    } else {
      // Crear
      const nuevo = {
        id: Math.max(0, ...users.map((u) => u.id)) + 1,
        nombre: form.nombre,
        correo: form.correo,
        rol: form.rol,
        estado: form.estado,
        avatar: form.avatar || "",
        // Nota: en demo, no guardamos password; en producción, envíala al backend
      };
      setUsers((prev) => [nuevo, ...prev]);
      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        timer: 1400,
        showConfirmButton: false,
      });
    }
    setModalOpen(false);
  };

  const badgeRol = (rol) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        rol === "admin"
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700"
      }`}>
      {rol}
    </span>
  );

  const badgeEstado = (estado) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        estado === "activo"
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-700"
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
            Gestión de Usuarios
          </h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <FontAwesomeIcon icon={faPlus} />
            Nuevo usuario
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Aquí puedes ver, editar o eliminar usuarios registrados.
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
              placeholder="Buscar por nombre, correo, rol o estado..."
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
                  <th className="px-4 py-3">Avatar</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 w-56">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500">
                      No hay resultados.
                    </td>
                  </tr>
                )}

                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.nombre}
                          className="h-10 w-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 border flex items-center justify-center text-gray-500">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{u.nombre}</td>
                    <td className="px-4 py-3">{u.correo}</td>
                    <td className="px-4 py-3">{badgeRol(u.rol)}</td>
                    <td className="px-4 py-3">{badgeEstado(u.estado)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleEstado(u)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-600 text-white hover:bg-slate-700"
                          title="Activar/Bloquear">
                          <FontAwesomeIcon icon={faToggleOn} />
                          {u.estado === "activo" ? "Bloquear" : "Activar"}
                        </button>
                        <button
                          onClick={() => openEdit(u)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                          title="Editar">
                          <FontAwesomeIcon icon={faPenToSquare} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
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
                  {editing ? "Editar usuario" : "Nuevo usuario"}
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
                  icon={faUser}
                  label="Nombre"
                  value={form.nombre}
                  onChange={(v) => setForm((f) => ({ ...f, nombre: v }))}
                  placeholder="Ej. Ana Gómez"
                  required
                />
                <Field
                  icon={faEnvelope}
                  label="Correo"
                  type="email"
                  value={form.correo}
                  onChange={(v) => setForm((f) => ({ ...f, correo: v }))}
                  placeholder="Ej. ana@example.com"
                  required
                />

                {/* Avatar */}
                <FieldImage
                  label="Avatar"
                  value={form.avatar}
                  onChange={(v) => setForm((f) => ({ ...f, avatar: v }))}
                />

                {/* Rol */}
                <FieldSelect
                  icon={faShieldHalved}
                  label="Rol"
                  value={form.rol}
                  onChange={(v) => setForm((f) => ({ ...f, rol: v }))}
                  options={[
                    { value: "usuario", label: "usuario" },
                    { value: "admin", label: "admin" },
                  ]}
                />

                {/* Estado */}
                <FieldSelect
                  icon={faToggleOn}
                  label="Estado"
                  value={form.estado}
                  onChange={(v) => setForm((f) => ({ ...f, estado: v }))}
                  options={[
                    { value: "activo", label: "activo" },
                    { value: "bloqueado", label: "bloqueado" },
                  ]}
                />

                {/* Password (solo al crear; al editar es opcional/oculto según prefieras) */}
                {!editing && (
                  <Field
                    icon={faShieldHalved}
                    label="Contraseña (solo creación)"
                    type="password"
                    value={form.password}
                    onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                )}

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
                    {editing ? "Guardar cambios" : "Crear usuario"}
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
          onChange={(e) => onChange(e.target.value)}>
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

/**
 * Campo de imagen con vista previa (Base64 en memoria)
 */
function FieldImage({ label, value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no válido",
        text: "Solo imágenes JPEG, PNG o WEBP.",
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
            alt="Avatar"
            className="h-16 w-16 rounded-full object-cover border"
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
