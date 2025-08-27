import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setPersistence, browserLocalPersistence } from "firebase/auth";


export function PrivateRoutes({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          Cookies.set("token", token, { expires: 1 / 24 });
          setUser(firebaseUser);
        } else {
          if (Cookies.get("token")) {
            Cookies.remove("token");
          }

          setUser(null);
        }
        setLoading(false);
      });
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div role="status" className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
