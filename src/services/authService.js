// src/services/authService.js
import {
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence
} from "firebase/auth";
import Cookies from "js-cookie";
import { auth } from "../../firebase";

export async function login(email, password) {
  // 1) Fuerza a Firebase a usar SOLO memoria
  await setPersistence(auth, inMemoryPersistence);

  // 2) Ejecuta el login
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  // 3) Guarda únicamente en cookie (1 hora de vida)
  Cookies.set("token", token, { expires: 1 / 24 });

  return { email: userCredential.user.email };
}
