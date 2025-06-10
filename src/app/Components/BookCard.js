export default function Card() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm border-black-2 border-2">
      <h2 className="text-xl font-semibold mb-4">Titulo del libro</h2>
      <p className="text-gray-700 mb-4">Componente de tarjeta</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Detalles
      </button>
    </div>
  );
}
