import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BIBLIOFRID",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/1c719b87a2.js"
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <div className="grid grid-cols-[120px_auto] h-screen">
          {/* Sidebar - Columna Izquierda */}
          <div className=" text-white p-4">
            <Sidebar />
          </div>

          {/* Contenedor principal - Columna Derecha */}
          <div className="flex flex-col">
            {/* Topbar */}
            <Topbar />

            {/* Contenido principal debajo del Topbar */}
            <div className="flex-grow p-4">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
