import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ULALogo } from "@/assets/ula-logo";
import { auth } from "../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase"; // ajusta la ruta según tu estructura

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "tbl_users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const rolSeguro =
            rol.toLowerCase() === "administrador" ? "usuario" : rol.toLowerCase();

          await setDoc(userRef, {
            idUser: user.uid,
            email: user.email,
            rol: rolSeguro,
            status: "activo",
            password: "",
            creationDate: new Date(),
          });

          Cookies.set("userRol", rolSeguro);
        } else {
          const data = userSnap.data();

          if (data.rol !== rol.toLowerCase()) {
            setError(`Este correo ya está registrado como "${data.rol}". Has seleccionado "${rol}". Por favor, selecciona el rol correcto.`);
            return;
          }

          Cookies.set("userRol", data.rol || "usuario");
        }

        Cookies.set("userEmail", user.email || "");
        Cookies.set("userId", user.uid);

        navigate("/");
      }
    } catch (err) {
      console.error("Error de login", err.code, err.message);
      setError("Correo o contraseña incorrectos.");
    }
  };



  return (
    <div className="min-h-screen bg-green-900 flex flex-col items-center justify-start pt-12 px-4 sm:pt-10">
      <div className="w-full max-w-md md:max-w-sm lg:max-w-md mx-auto py-6 space-y-8">
        <div className="flex justify-center">
          <ULALogo className="w-12 h-12 sm:w-14 sm:h-14 mb-4" />
        </div>

        <div className="text-center px-2">
          <p className="text-white text-xs">
            ¡Inicia sesión y empieza a gestionar tus archivos!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-2">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-emerald-800 text-base border-slate-600 placeholder:text-white text-white focus:bg-emerald-600 transition-colors"
              required
            />
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full bg-emerald-800 text-sm border border-slate-600 text-white placeholder:text-white text-white focus:bg-emerald-600 transition-colors rounded-md py-2 px-2 "
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="administrador">Administrador</option>
              <option value="usuario">Usuario</option>
              <option value="visitante">Visitante</option>
            </select>


            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-emerald-800 text-base border-slate-600 placeholder:text-white text-white focus:bg-emerald-600 transition-colors"
              required
            />
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-colors"
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </div>


      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg
          className="w-full h-auto aspect-[1700/320]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#fff"
            d="M0,256L80,229.3C160,203,320,149,480,154.7C640,160,800,224,960,229.3C1120,235,1280,181,1360,154.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full h-auto aspect-[1850/300]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ccc"
            d="M1440,256L1360,229.3C1280,203,1120,149,960,154.7C800,160,640,224,480,229.3C320,235,160,181,80,154.7L0,128L0,320L80,320C160,320,320,320,480,320C640,320,800,320,960,320C1120,320,1280,320,1360,320L1440,320Z"
          ></path>
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full h-auto aspect-[3000/300]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#065f46"
            d="M0,256L80,229.3C160,203,320,149,480,154.7C640,160,800,224,960,229.3C1120,235,1280,181,1360,154.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
