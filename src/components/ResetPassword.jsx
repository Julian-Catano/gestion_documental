import { useState } from "react";
import {
  getAuth,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    const auth = getAuth();
    const emailToCheck = email.trim().toLowerCase();

    try {
      await sendPasswordResetEmail(auth, emailToCheck);
      Swal.fire({
        title: "Correo enviado",
        text: "Revisa tu bandeja de entrada o carpeta de spam.",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error:", error.code, error.message);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-green-900 px-4">
      <div className="w-full max-w-sm flex flex-col gap-4 items-center">
        <h1 className="text-white text-center text-lg font-medium">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-gray-300 text-sm text-center">
          Ingresa tu correo para enviarte un enlace de recuperación.
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full bg-green-800 text-white placeholder-gray-400 border border-white/20 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleResetPassword}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:brightness-110 text-white py-2 rounded-md transition duration-200"
        >
          Recuperar contraseña
        </button>

        <p className="text-gray-300 text-xs text-center">
          Asegurate de que este bien escrito!
        </p>
      </div>
    </div>
  );
}
