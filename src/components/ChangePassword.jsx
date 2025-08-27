import { useEffect, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const email = Cookies.get("userEmail");
    if (email) {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Swal.fire({
            title:
              "¡Correo de restablecimiento enviado. Revisa tu bandeja de entrada o spam!",
            text: "Tu acción se realizo con exito",
            icon: "success",
            timer: 3000,
            confirmButtonText: "OK",
          });
          //   setMessage("Correo de restablecimiento enviado. Revisa tu bandeja de entrada.");
        })
        .catch((error) => {
          setMessage("Error: " + error.message);
        });
    } else {
      Swal.fire({
        title: "No se encontró un correo almacenado.",
        text: "Tu acción no se pudo realizar",
        icon: "error",
        timer: 3000,
        confirmButtonText: "OK",
      });
    //   setMessage("No se encontró un correo almacenado.");
    }
  }, []);

}
