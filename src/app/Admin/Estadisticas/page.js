export default function AdminStatistics() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Estadísticas del Sistema
        </h1>
        <p className="text-gray-600 mb-4">
          Aquí puedes ver las estadísticas generales del sistema, incluyendo el
          número de usuarios, libros y préstamos.
        </p>
        {/* Aquí podrías agregar gráficos o tablas con las estadísticas */}
      </div>
    </div>
  );
}
