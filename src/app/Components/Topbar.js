export default function Topbar() {
  return (
    <div className=" w-full h-22 bg-gray-800 p-4 flex items-center justify-between ">
      <div className="text-white flex items-center space-x-4 ml-8">
        <span className="text-3xl font-semibold">Bienvenido </span>
      </div>
      <div className="text-white flex justify-end  w-full  mr-8 space-x-10">
        <i class="fa-solid fa-calendar-days fa-2xl"></i>
        <i class="fa-solid fa-ellipsis-vertical fa-2xl"></i>
      </div>
    </div>
  );
}
