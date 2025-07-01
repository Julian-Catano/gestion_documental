"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ChangePassword";

const MisDatos = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    creationDate: "",
    role: "",
    status: "",
  });

  const user = auth.currentUser;
  const userId = user.uid; //

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "tbl_users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        const creationDate = data.creationDate?.toDate
          ? data.creationDate.toDate().toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "";

        setUserData({
          ...data,
          creationDate,
        });
      }
      console.log(docSnap.data());
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleRedirect = (e) => {
    navigate("/MineFiles");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const docRef = doc(db, "tbl_users", userId);
    await updateDoc(docRef, userData);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full p-5 font-sans">
      <div className="bg-gray-50 border-2 rounded-xl p-8 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">MIS DATOS</h2>

        <div className="flex flex-col gap-4 mb-8">
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className={`p-3 rounded-md ${
              isEditing ? "bg-white" : "bg-gray-200"
            } text-gray-600 text-sm`}
            readOnly={!isEditing}
          />

          <input
            type="text"
            name="creationDate"
            value={userData.creationDate}
            onChange={handleChange}
            className={`p-3 rounded-md ${
              isEditing ? "bg-white" : "bg-gray-200"
            } text-gray-600 text-sm`}
            readOnly={!isEditing}
          />

          <input
            type="text"
            name="role"
            value={userData.rol}
            onChange={handleChange}
            className={`p-3 rounded-md ${
              isEditing ? "bg-white" : "bg-gray-200"
            } text-gray-600 text-sm`}
            readOnly={!isEditing}
          />

          <input
            type="text"
            name="status"
            value={userData.status}
            onChange={handleChange}
            className={`p-3 rounded-md ${
              isEditing ? "bg-white" : "bg-gray-200"
            } text-gray-600 text-sm`}
            readOnly={!isEditing}
          />
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-col text-xs space-y-2">
            <button
              onClick={() => setShowReset(true)}
              className="text-left text-gray-500 hover:text-green-500 transition-colors duration-200"
            >
              ¿Cambiar contraseña?
            </button>

            {showReset && (
              <div className="mt-2">
                <ResetPassword />
              </div>
            )}
          </div>

          <button
            className="bg-green-600 text-white px-5 py-2.5 rounded-md text-sm hover:bg-green-700 ml-auto"
            onClick={handleRedirect}
          >
            Historial de archivos
          </button>
        </div>
      </div>
    </div>
  );
};

export default MisDatos;
