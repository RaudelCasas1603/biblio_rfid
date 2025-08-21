import {
  faDesktop,
  faCalendarDays,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Topbar() {
  return (
    <div className="h-20 bg-gray-800 px-6 flex items-center justify-between">
      <div className="text-white flex items-center space-x-4">
        <span className="text-3xl font-semibold ">Bienvenido </span>
      </div>
      <div className="text-white flex justify-end  w-full  mr-8 space-x-10">
        <Link href="/LiberarLibro">
          <FontAwesomeIcon
            icon={faSquarePlus}
            className="fa-2xl hover:text-blue-300 transition-colors duration-200"
          />
        </Link>
        <Link href="/Admin">
          <FontAwesomeIcon
            icon={faDesktop}
            className="fa-2xl hover:text-blue-300 transition-colors duration-200"
          />
        </Link>
        <Link href="/Calendario">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="fa-2xl hover:text-blue-300 transition-colors duration-200"
          />
        </Link>
      </div>
    </div>
  );
}
