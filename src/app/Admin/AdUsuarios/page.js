"use client";
import { useEffect, useMemo, useState } from "react";
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
  const [users, setUsers] = useState([]);
  const [tiposUsuario, setTiposUsuario] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "", // ahora se guarda el id real de tipo usuario
    estado: "activo",
    avatar: "",
    password: "",
    passwordConfirm: "", // confirmación de la contraseña
  });

  // 🔄 Cargar tipos de usuario al montar
  useEffect(() => {
    async function fetchTipos() {
      try {
        const res = await fetch("/api/tipo_usuario/all/");
        if (!res.ok) throw new Error("Error al cargar roles");
        const data = await res.json();
        setTiposUsuario(data);
      } catch (err) {
        console.error("Error cargando tipos de usuario:", err);
      }
    }

    async function fetchUsuarios() {
      try {
        const res = await fetch("/api/usuario/all/");
        if (!res.ok) throw new Error("Error al cargar usuarios");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    }

    fetchTipos();
    fetchUsuarios();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.nombre_usuario.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.fk_id_tipo_usuario.toLowerCase().includes(q) ||
        u.estado.toLowerCase().includes(q)
    );
  }, [users, query]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nombre: "",
      correo: "",
      rol: tiposUsuario.length > 0 ? tiposUsuario[0].id : "",
      estado: "activo",
      avatar: "",
      password: "",
      passwordConfirm: "", // Asegurando que el campo esté vacío al crear
    });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      nombre: user.nombre_usuario,
      correo: user.email,
      rol: user.fk_id_tipo_usuario,
      estado: user.estado,
      avatar: user.avatar || "",
      password: "", // No prellenar la contraseña
      passwordConfirm: "", // No prellenar la confirmación de la contraseña
    });
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Eliminar usuario",
      text: `¿Seguro que deseas eliminar a "${user.nombre_usuario}"?`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      try {
        const deleteRes = await fetch(`/api/usuario/delete/${user.pk_id_usuario}`, {
          method: "DELETE",
        });
        if (!deleteRes.ok) throw new Error("Error al eliminar usuario");

        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          timer: 1400,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el usuario",
        });
      }
    }
  };

  const toggleEstado = async (user) => {
    const nuevoEstado = user.estado === "activo" ? "bloqueado" : "activo";
    const res = await Swal.fire({
      icon: "question",
      title: `Cambiar estado`,
      text: `¿Deseas cambiar el estado de ${user.nombre_usuario} a "${nuevoEstado}"?`,
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

  // Validaciones antes de enviar
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

  // Validación de la contraseña
  if (!editing) {
    if (!form.password || form.password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña requerida",
        text: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }
    if (form.password !== form.passwordConfirm) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "La contraseña y su confirmación deben coincidir",
      });
      return;
    }
  }

  if (editing) {
    // Código para actualizar el usuario
    const updatedUser = {
      id: editing.id,  // Asegúrate de tener este campo
      pk_id_usuario: editing.pk_id_usuario, // Asegúrate de que esto esté en el objeto `editing`
      nombre_usuario: form.nombre,
      password: form.password || editing.password, // Mantener la contraseña anterior si no se cambia
      passwordConfirm: form.passwordConfirm || form.password, // Confirmación de la nueva contraseña
      verified: true,
      email: form.correo,
      fk_id_tipo_usuario: form.rol, // ID del tipo de usuario
      created_at: editing.created_at, // Fecha de creación
      updated_at: "", // Fecha de actualización
    };

    try {
      const res = await fetch("/api/usuario/update/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser), // Convertir a JSON
      });

      if (!res.ok) throw new Error("Error al actualizar el usuario");

      const data = await res.json();
      console.log("Usuario actualizado en backend:", data);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id ? { ...data, estado: form.estado } : u
        )
      );

      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario en el servidor",
      });
    }
  } else {
    // Código para crear usuario, si no se está editando.
    try {
      // 🚀 obtener el último id de usuario
      const res_last = await fetch("/api/usuario/ultimo_usuario_id");
      if (!res_last.ok) throw new Error("Error al consultar último usuario id");
      const lastId = await res_last.json();
      const nuevoId = Number(lastId) + 1; // Sumar 1 al último ID

      const now = new Date().toISOString();

      // 🚀 Crear usuario en API con el formato correcto
      const nuevoUsuario = {
        id: "",  // Deja en blanco, ya que el backend puede generar uno
        pk_id_usuario: nuevoId, // Asignamos el nuevo ID sumado
        nombre_usuario: form.nombre,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        verified: true,
        email: form.correo,
        fk_id_tipo_usuario: form.rol, // ID del tipo de usuario
        created_at: now,  // Fecha actual
        updated_at: "", // Deja vacío, el backend asignará la fecha
      };

      const res = await fetch("/api/usuario/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario), // Convertir el objeto a JSON
      });

      if (!res.ok) throw new Error("Error al crear usuario");

      const data = await res.json();
      console.log("Usuario creado en backend:", data);

      // Agregar el nuevo usuario a la lista local
      setUsers((prev) => [
        {
          ...data, // Datos devueltos por la API
        },
        ...prev,
      ]);

      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario en el servidor",
      });
    }
  }

  setModalOpen(false);
};


  const badgeRol = (rol) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        rol === "Administrador"
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
                      {/* Avatar predeterminado */}
                      <div className="h-10 w-10 rounded-full bg-gray-200 border flex items-center justify-center text-gray-500">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    </td>
                    <td className="px-4 py-3">{u.nombre_usuario}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      {badgeRol(tiposUsuario.find((t) => t.id === u.fk_id_tipo_usuario)?.rol || "Desconocido")}
                    </td>
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

                {/* Rol dinámico */}
                <FieldSelect
                  icon={faShieldHalved}
                  label="Rol"
                  value={form.rol}
                  onChange={(v) => setForm((f) => ({ ...f, rol: v }))}
                  options={tiposUsuario.map((t) => ({
                    value: t.id,
                    label: t.rol,
                  }))}
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

                {/* Password */}
                {!editing && (
                  <Field
                    icon={faShieldHalved}
                    label="Contraseña (solo creación)"
                    type="password"
                    value={form.password}
                    onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                )}
                {editing && (
                  <Field
                    icon={faShieldHalved}
                    label="Contraseña nueva"
                    type="password"
                    value={form.password}
                    onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                    placeholder="Dejar vacío si no quieres cambiarla"
                  />
                )}
                {editing && (
                  <Field
                    icon={faShieldHalved}
                    label="Confirmar nueva contraseña"
                    type="password"
                    value={form.passwordConfirm}
                    onChange={(v) => setForm((f) => ({ ...f, passwordConfirm: v }))}
                    placeholder="Confirmar nueva contraseña"
                    required={editing}
                  />
                )}
                {!editing && (
                  <Field
                    icon={faShieldHalved}
                    label="Confirmar Contraseña"
                    type="password"
                    value={form.passwordConfirm}
                    onChange={(v) => setForm((f) => ({ ...f, passwordConfirm: v }))}
                    placeholder="Confirma tu contraseña"
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

/* ---------- Componentes auxiliares ---------- */
function Field({ label, icon, type = "text", value, onChange, placeholder, required }) {
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
