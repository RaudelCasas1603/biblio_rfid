import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GenreCard({ name, icon, onClick, activo }) {
  return (
    <button
      onClick={onClick}
      className={`flex text-xl font-semibold items-center space-x-2 p-3 rounded-xl hover:bg-blue-500 border transition-colors-duration-700 ${
        activo ? "bg-blue-500 text-white" : "bg-white text-gray-800"
      }`}>
      <FontAwesomeIcon icon={icon} />
      <h2>{name}</h2>
    </button>
  );
}
