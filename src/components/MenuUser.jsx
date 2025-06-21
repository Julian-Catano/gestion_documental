import { User, Settings } from "lucide-react";
import LogoutButton from "../components/LogoutButton";

export default function UserDropdown() {
  return (
    <div className="absolute right-0 top-10 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      {/* Opción Perfil */}
      <button
        onClick={() => (window.location.href = "/Profile")}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-emerald-100 transition-colors"
      >
        <User className="w-5 h-5 text-emerald-900" />
        <span className="text-sm font-medium text-emerald-900">Perfil</span>
      </button>

      {/* Opción Configuración */}
      <button
        onClick={() => (window.location.href = "/Settings")}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-emerald-100 transition-colors"
      >
        <Settings className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Configuración</span>
      </button>

      {/* Botón Cerrar sesión */}
      <div className="px-4 py-3">
        <LogoutButton />
      </div>
    </div>
  );
}
