import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GenreCard({ name, icon }) {
  return (
    <div className="bg-white shadow-md rounded-lg w-fit max-w-lg text-center mb-3 px-2 pt-2 hover:bg-blue-500 transition-colors duration-500">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-center space-x-2">
        <FontAwesomeIcon icon={icon} className="text-black-600 text-2xl" />
        <span>{name}</span>
      </h2>
    </div>
  );
}
