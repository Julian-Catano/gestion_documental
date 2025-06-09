import { User } from "lucide-react";
import LogoutButton from "../components/LogoutButton"; // ajusta la ruta según tu estructura
import AppRoutes from "@/routes/AppRoutes";


export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <header className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 font-bold text-sm mr-4">
            ULA
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">{localStorage.getItem("userEmail")}</span>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        <aside className="w-48 bg-green-500 relative">
          <nav className="p-4 space-y-2">
            <a href="/ListFiles" className="block text-white hover:bg-green-600 px-4 py-3 rounded transition-colors">
              Gestión de archivos
            </a>
            <a href="/ListFiles" className="block text-white hover:bg-green-600 px-4 py-3 rounded transition-colors">
              Perfil
            </a>
            <a href="/" className="block text-white hover:bg-green-600 px-4 py-3 rounded transition-colors">
              Inicio
            </a>
          </nav>

          {/* Si este triángulo es decorativo, ajusta el tamaño o elimínalo */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[100vh] border-t-black transform translate-x-full pointer-events-none"></div>
        </aside>

        <main className="flex-1 bg-gray-200 relative">
          {/* Triángulo decorativo */}
          <div className="absolute left-0 top-0 w-0 h-0 border-l-[40px] border-l-green-500 border-b-[100vh] border-b-transparent pointer-events-none"></div>

          <div className="ml-10 flex items-center justify-center h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
