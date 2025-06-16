import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-30 h-full bg-gray-800 p-4 z-10">
      {/* Sidebar component, with icons pending addition  */}
      <div className="flex items-center justify-center">
        <img src="/next.svg" alt="Logo" className=" w-24 h-24" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-10">
        <div className="flex items-center justify-center h-20 ">
          <Link href="/">
            <i className="fa-solid fa-house fa-2xl hover:text-blue-300 transition-colors duration-200"></i>
          </Link>
        </div>
        <div className="flex items-center justify-center h-20">
          <Link href="/">
            <i className="fa-solid fa-lightbulb fa-2xl hover:text-blue-300 transition-colors duration-200"></i>
          </Link>
        </div>
        <div className="flex items-center justify-center h-20">
          <Link href="/">
            <i className="fa-solid fa-magnifying-glass fa-2xl hover:text-blue-300 transition-colors duration-200"></i>
          </Link>
        </div>
        <div className="flex items-center justify-center h-20">
          <Link href="/">
            <i className="fa-regular fa-user fa-2xl hover:text-blue-300 transition-colors duration-200"></i>
          </Link>
        </div>
      </div>
      <div className="flex  items-center justify-center w-full pt-40">
        <i className="fa-solid fa-circle-info fa-2xl hover:text-blue-300 transition-colors duration-200"></i>
      </div>
    </div>
  );
}
