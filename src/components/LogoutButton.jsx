// src/components/LogoutButton.jsx
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRol");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
