import { Cookie, User, Menu } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import { useState } from "react";
import MenuUser from "../components/MenuUser";
import Cookies from "js-cookie";

export default function Layout({ children }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navbar */}
      <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* Botón hamburguesa solo en pantallas pequeñas */}
          <button
            className="md:hidden p-2 rounded text-green"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>

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
          <span className="text-sm text-gray-500 hidden sm:inline">
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

      <div className="flex rounded-xl shadow-md overflow-hidden bg-white min-h-[calc(100vh-112px)]">
        {/* Sidebar fija en pantallas grandes */}
        <aside className="hidden md:block w-56 bg-green-600 text-white p-4 rounded-l-xl">
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

        {/* Sidebar móvil */}
        {showSidebar && (
          <aside className="fixed top-0 left-0 w-56 h-full bg-green-600 text-white p-4 z-50 flex flex-col justify-center">
            {/* Botón de cerrar */}
            <button
              className="absolute top-3 right-3 p-1 text-white text-lg"
              onClick={toggleSidebar}
            >
              X
            </button>

            {/* Links centrados */}
            <nav className="space-y-4 text-center">
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
              <a
                href="/"
                className="block hover:bg-green-500 px-4 py-3 rounded"
              >
                Inicio
              </a>
            </nav>
          </aside>
        )}

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
