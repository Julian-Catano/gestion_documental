// src/services/authService.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  localStorage.setItem("token", token);

  return { email: userCredential.user.email };
}
