import {
  faDesktop,
  faCalendarDays,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Topbar() {
  return (
    <div className="fixed top-0 left-0 w-full h-22 bg-gray-800 p-4 flex items-center justify-between ">
      <div className="text-white flex items-center space-x-4 ml-8">
        <span className="text-3xl font-semibold ml-25 ">Bienvenido </span>
      </div>
      <div className="text-white flex justify-end  w-full  mr-8 space-x-10">
        <FontAwesomeIcon
          icon={faDesktop}
          className="fa-2xl hover:text-blue-300 transition-colors duration-200"
        />
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="fa-2xl hover:text-blue-300 transition-colors duration-200"
        />
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className="fa-2xl hover:text-blue-300 transition-colors duration-200"
        />
      </div>
    </div>
  );
}
