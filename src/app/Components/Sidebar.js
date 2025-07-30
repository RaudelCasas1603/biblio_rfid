import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faFireFlameCurved,
  faMagnifyingGlass,
  faCircleInfo,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-30 h-full bg-gray-800 p-4 z-10">
      {/* Sidebar component, with icons pending addition  */}
      <div className="flex items-center justify-center">
        <img src="/logo.webp" alt="Logo" className=" w-18 h-22 mb-8" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-8 mt-4">
        <div className="flex items-center justify-center h-20 ">
          <Link href="/">
            <FontAwesomeIcon
              icon={faHouse}
              className="fa-2xl hover:text-blue-300 transition-colors duration-200"
            />
          </Link>
        </div>
        <div className="flex items-center justify-center h-20">
          <Link href="/Recomendaciones">
            <FontAwesomeIcon
              icon={faFireFlameCurved}
              className="fa-2xl hover:text-red-300 transition-colors duration-200"
            />
          </Link>
        </div>
        <div className="flex items-center justify-center h-20">
          <Link href="/Buscar">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="fa-2xl hover:text-blue-300 transition-colors duration-200"
            />
          </Link>
        </div>
        <div className="flex items-center justify-center h-20">
          <Link href="/User">
            <FontAwesomeIcon
              icon={faUser}
              className="fa-2xl hover:text-blue-300 transition-colors duration-200"
            />
          </Link>
        </div>
      </div>
      <div className="flex  items-center justify-center w-full pt-40">
        <Link href="/FAQ">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="fa-2xl hover:text-blue-300 transition-colors duration-200"
          />
        </Link>
      </div>
    </div>
  );
}
