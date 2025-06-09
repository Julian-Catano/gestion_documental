import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase"
import { Navigate } from "react-router-dom"

export function PrivateRoutes({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        localStorage.setItem("token", token)
        setUser(firebaseUser)
      } else {
        localStorage.removeItem("token")
        setUser(null)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Cargando...</p>
  return user ? children : <Navigate to="/login" replace />
}
