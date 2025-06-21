"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs, limit, startAfter, orderBy } from "firebase/firestore"
import { auth, db } from "../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


export default function TablaArchivos() {
  const [archivos, setArchivos] = useState([])
  const [lastDoc, setLastDoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null)

  const fetchArchivos = async (reset = false) => {
    if (!userId || loading) return

    setLoading(true)
    try {
      if (reset) {
        setLastDoc(null)
      }

      let baseQuery = query(
        collection(db, "tbl_files"),
        where("creationIdUser", "==", userId),
        orderBy("creationDate", "desc"),
        limit(10)
      )

      if (lastDoc && !reset) {
        baseQuery = query(baseQuery, startAfter(lastDoc))
      }

      const snapshot = await getDocs(baseQuery)

      console.log(snapshot
      )

      const nuevosArchivos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setArchivos(reset ? nuevosArchivos : [...archivos, ...nuevosArchivos])
    } catch (error) {
      console.error("Error al cargar archivos:", error)
    } finally {
      setLoading(false)
    }


    console.log("Buscando archivos de:", userId)
    console.log("Último doc:", lastDoc)
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchArchivos(true)
    }
  }, [userId])

const handleDescargar = () => {
  const doc = new jsPDF()

  doc.text("Listado de Archivos", 14, 20)

  const tableData = archivos.map((archivo) => [
    archivo.id,
    archivo.name,
    archivo.description,
    archivo.creationDate?.toDate?.().toLocaleDateString() ?? "—"
  ])

  autoTable(doc, {
    startY: 30,
    head: [["ID", "Nombre", "Descripción", "Fecha"]],
    body: tableData
  })

  doc.save("HistorialArchivos.pdf")
}



  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Descripción</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {archivos.map((archivo) => (
              <tr key={archivo.id} className="bg-white">
                <td className="px-4 py-3 text-sm text-gray-500">{archivo.id}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{archivo.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{archivo.description}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {archivo.creationDate?.toDate?.().toLocaleDateString() ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleDescargar}
          className="bg-green-600 hover:bg-emerald-600 text-white py-2 px-6 rounded-md transition-colors"
        >
          Descargar
        </button>

        {lastDoc ? (
          <button
            disabled={loading}
            onClick={() => fetchArchivos()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Siguiente"}
          </button>
        ) : (
          <span className="text-sm text-gray-400">No hay más archivos</span>
        )}
      </div>
    </div>
  )
}
