import { Cookie, User } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";
import MenuUser from "../components/MenuUser";
import Cookies from "js-cookie";

export default function Layout({ children }) {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navbar flotante redondeada */}
      <div className="bg-white text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg mr-4">
            ULA
          </div>
          <p
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
              Cookies.get("userRol") === "administrador"
                ? "bg-green-50 text-green-700 border-green-300"
                : Cookies.get("userRol") === "usuario"
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {Cookies.get("userRol")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {Cookies.get("userEmail")}
          </span>
          <div className="relative inline-block text-left">
            <div
              className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer"
              onClick={toggleMenu}
            >
              <User size={16} color="white" />
            </div>

            {showMenu && <MenuUser />}
          </div>
        </div>
      </div>

      {/* Contenedor principal redondeado */}
      <div className="flex rounded-xl shadow-md overflow-hidden bg-white min-h-[calc(100vh-112px)]">
        {/* Sidebar redondeada a la izquierda */}
        <aside className="w-56 bg-green-600 text-white p-4 rounded-l-xl">
          <nav className="space-y-2">
            <a
              href="/ListFiles"
              className="block hover:bg-green-500 px-4 py-3 rounded"
            >
              Gestión de archivos
            </a>
            <a
              href="/MineFiles"
              className="block hover:bg-green-500 px-4 py-3 rounded"
            >
              Historial de Archivos
            </a>
            <a href="/" className="block hover:bg-green-500 px-4 py-3 rounded">
              Inicio
            </a>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 relative overflow-auto bg-white">
          <div className="relative z-10 p-8">
            <div className="bg-white border shadow-md rounded-lg p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
