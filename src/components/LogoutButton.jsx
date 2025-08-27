import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);

    Cookies.remove("userEmail");
    Cookies.remove("userId");
    Cookies.remove("userRol");
    Cookies.remove("token");

    localStorage.clear();

    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-green-600 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
