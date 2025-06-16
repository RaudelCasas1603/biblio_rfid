export default function GenreCard({ name, icon }) {
  return (
    <div className="bg-white shadow-md rounded-lg w-fit max-w-lg text-center mt-24 mb-3 px-2 pt-2 hover:bg-blue-500 transition-colors duration-500 ">
      <h2 className="text-xl font-semibold mb-4">
        {name} {icon && <i className={icon}></i>}
      </h2>
    </div>
  );
}
