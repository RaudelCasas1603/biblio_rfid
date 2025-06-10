export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-40 h-full bg-gray-800 p-4">
      {/* Sidebar component, with icons pending addition  */}
      <div className="flex items-center justify-center">
        <img src="/next.svg" alt="Logo" className=" w-24 h-24" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="flex items-center justify-center h-20">
          <p className="text-white">Inicio</p>
        </div>
        <div className="flex items-center justify-center h-20">
          <p className="text-white">Recomendaciones</p>
        </div>
        <div className="flex items-center justify-center h-20">
          <p className="text-white">Buscar</p>
        </div>
        <div className="flex items-center justify-center h-20">
          <p className="text-white">Perfil</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4">
        <p className="text-white text-center">¿Necesitas Ayuda?</p>
      </div>
    </div>
  );
}
