"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "@/components/FileUpload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function FileList() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [viewingFile, setViewingFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("Todos");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectView, setSelectView] = useState("");

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const q = query(
      collection(db, "tbl_files"),
      orderBy("creationDate", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fileList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFiles(fileList);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectFile = (fileId, checked) => {
    const updated = new Set(selectedFiles);
    checked ? updated.add(fileId) : updated.delete(fileId);
    setSelectedFiles(updated);
  };

  const handleViewFile = () => {
    if (selectedFiles.size === 1) {
      const fileId = Array.from(selectedFiles)[0];
      const file = files.find((f) => f.id === fileId);
      setViewingFile(file);

      const bucketName = "gestiondocumental-ff0fd.firebasestorage.app";
      const filePath = file.path || "default.docx";
      const encodedPath = encodeURIComponent(filePath);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
      setSelectView(publicUrl);
    }
  };

  // Filtrado de archivos según criterios
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFolder =
      selectedFolder === "Todos" || file.idTypeFile === selectedFolder;
    const matchesUser = selectedUser ? file.user === selectedUser : true;
    return matchesSearch && matchesFolder && matchesUser;
  });

  // Calcular índices para paginación
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstRow, indexOfLastRow);

  // Número total de páginas
  const totalPages = Math.ceil(filteredFiles.length / rowsPerPage);

  // Funciones para manejar cambio de página
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };
  const goToPrevPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className=" flex justify-center">
      <div className="p-6 min-w-[300px] max-w-6xl w-full mx-auto mt-5 max-h-[80vh] overflow-y-auto"> {/* << Aún hay que revisar esta clase */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gestión de Archivos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-4 flex-wrap">
              <Select onValueChange={setSelectedUser}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario1">Usuario 1</SelectItem>
                  <SelectItem value="usuario2">Usuario 2</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setSelectedFolder} value={selectedFolder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por carpeta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="1. Asignación de una persona que diseñe e implemente SST">
                    1. Asignación de una persona que diseñe e implemente SST
                  </SelectItem>
                  <SelectItem value="2. Asignación de responsabilidades en SST">
                    2. Asignación de responsabilidades en SST
                  </SelectItem>
                  <SelectItem value="3. Asignación de recursos para el Sistema de Gestión en SST">
                    3. Asignación de recursos para el Sistema de Gestión en SST
                  </SelectItem>
                  <SelectItem value="4. Afiliación al Sistema de Seguridad Social Integral">
                    4. Afiliación al Sistema de Seguridad Social Integral
                  </SelectItem>
                  <SelectItem value="5. COPASST">5. COPASST</SelectItem>
                  <SelectItem value="6. Convivencia Laboral">
                    6. Convivencia Laboral
                  </SelectItem>
                  <SelectItem value="7. Programa de capacitación anual">
                    7. Programa de capacitación anual
                  </SelectItem>
                  <SelectItem value="8. Política de Seguridad y Salud en el Trabajo y objetivos">
                    8. Política de Seguridad y Salud en el Trabajo y objetivos
                  </SelectItem>
                  <SelectItem value="9. Evaluación Inicial del Sistema de Gestión">
                    9. Evaluación Inicial del Sistema de Gestión
                  </SelectItem>
                  <SelectItem value="10. Plan Anual de Trabajo">
                    10. Plan Anual de Trabajo
                  </SelectItem>
                  <SelectItem value="11. Archivo y retención documental del Sistema de Gestión de SST">
                    11. Archivo y retención documental del Sistema de Gestión de
                    SST
                  </SelectItem>
                  <SelectItem value="12. Rendición de cuentas">
                    12. Rendición de cuentas
                  </SelectItem>
                  <SelectItem value="13. Matriz legal">
                    13. Matriz legal
                  </SelectItem>
                  <SelectItem value="14. Mecanismos de comunicación">
                    14. Mecanismos de comunicación
                  </SelectItem>
                  <SelectItem value="15. Identificación y evaluación para la adquisición de bienes y servicios">
                    15. Identificación y evaluación para la adquisición de bienes
                    y servicios
                  </SelectItem>
                  <SelectItem value="16. Evaluación y selección de proveedores y contratistas">
                    16. Evaluación y selección de proveedores y contratistas
                  </SelectItem>
                  <SelectItem value="17. Gestión del cambio">
                    17. Gestión del cambio
                  </SelectItem>
                  <SelectItem value="18. Descripción sociodemográfica - Registro de ausentismo - Registro de accidentalidad - Indicadores">
                    18. Descripción sociodemográfica - Registro de ausentismo -
                    Registro de accidentalidad - Indicadores
                  </SelectItem>
                  <SelectItem value="19. Actividades de medicina del trabajo y de prevención y promoción de la Salud">
                    19. Actividades de medicina del trabajo y de prevención y
                    promoción de la Salud
                  </SelectItem>
                  <SelectItem value="20. Perfiles de cargos">
                    20. Perfiles de cargos
                  </SelectItem>
                  <SelectItem value="21. Evaluaciones médicas ocupacionales">
                    21. Evaluaciones médicas ocupacionales
                  </SelectItem>
                  <SelectItem value="22. RIESGO PSICOSOCIAL">
                    22. RIESGO PSICOSOCIAL
                  </SelectItem>
                  <SelectItem value="23. ACCIDENTES DE TRABAJO">
                    23. ACCIDENTES DE TRABAJO
                  </SelectItem>
                  <SelectItem value="24. Identificación de peligros y evaluación y valoración de riesgos con participación de todos los niveles de la empresa">
                    24. Identificación de peligros y evaluación y valoración de
                    riesgos con participación de todos los niveles de la empresa
                  </SelectItem>
                  <SelectItem value="25. Inspecciones de seguridad">
                    25. Inspecciones de seguridad
                  </SelectItem>
                  <SelectItem value="26. Mantenimiento periódico de las instalaciones, equipos, máquinas y herramientas">
                    26. Mantenimiento periódico de las instalaciones, equipos,
                    máquinas y herramientas
                  </SelectItem>
                  <SelectItem value="27. EPPs">27. EPPs</SelectItem>
                  <SelectItem value="28. Auditoría">28. Auditoría</SelectItem>
                  <SelectItem value="29. Revisión por la dirección y rendición de cuentas">
                    29. Revisión por la dirección y rendición de cuentas
                  </SelectItem>
                  <SelectItem value="30. Acciones preventivas y/o correctivas y de mejora">
                    30. Acciones preventivas y/o correctivas y de mejora
                  </SelectItem>
                  <SelectItem value="31. Programas de vigilancia epidemiológica">
                    31. Programas de vigilancia epidemiológica
                  </SelectItem>
                  <SelectItem value="32. Plan de emergencias">
                    32. Plan de emergencias
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar archivo..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleViewFile}
                disabled={selectedFiles.size !== 1}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" /> Ver
              </Button>
              <Dialog className="max-h-md"open={showUpload} onOpenChange={setShowUpload}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-6 h-2 mr-2" /> Nuevo +
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-lg font-semibold mb-4">Subir archivo</h2>
                  <FileUpload />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 max-w-full overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Selecciona</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Modificación</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFiles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay archivos disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentFiles.map((file) => (
                    <TableRow
                      key={file.id}
                      className={selectedFiles.has(file.id) ? "bg-blue-50" : ""}
                    >
                      {/* Celda de Checkbox: Puedes darle un ancho fijo pequeño */}
                      <TableCell className="w-[50px] text-center"> {/* Ajustado para centrar y un ancho fijo */}
                        <Checkbox
                          checked={selectedFiles.has(file.id)}
                          onCheckedChange={(checked) =>
                            handleSelectFile(file.id, checked)
                          }
                        />
                      </TableCell>
                      {/* ID: Ancho fijo para IDs si son de longitud constante */}
                      <TableCell className="w-[80px] truncate">{file.id}</TableCell>
                      {/* Nombre: truncate y un max-w para nombres de archivo */}
                      <TableCell className="truncate max-w-[250px]">{file.name}</TableCell>
                      {/* Tipo (idTypeFile): truncate y max-w para los nombres de carpeta/tipo */}
                      <TableCell className="truncate max-w-[200px]">{file.idTypeFile}</TableCell>
                      {/* Descripción: truncate y un max-w más generoso para descripciones */}
                      <TableCell className="truncate max-w-[300px]">{file.description}</TableCell>
                      {/* Fecha: Ancho fijo para fechas, ya que son de longitud constante */}
                      <TableCell className="w-[120px]">
                        {file.creationDate?.toDate().toLocaleDateString()}
                      </TableCell>
                      {/* Modificación: Ancho fijo para fechas */}
                      <TableCell className="w-[120px]">
                        {file.creationDate?.toDate().toLocaleDateString()}
                      </TableCell>
                      {/* Usuario (email): truncate y max-w para emails largos */}
                      <TableCell className="truncate max-w-[150px]">{file.creationEmailUser}</TableCell>
                      {/* URL: truncate y max-w para URLs, ya lo tenías */}
                      <TableCell className="truncate max-w-[180px]">
                        {file.url}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>

          {/* Controles de paginación */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span>Filas por página:</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={handleRowsPerPageChange}
                className="w-[70px]"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {viewingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[80vh] overflow-auto p-4 relative">
              <button
                onClick={() => {
                  setViewingFile(null);
                  setSelectView("");
                }}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="mb-4 font-semibold text-lg">{viewingFile.name}</h3>
              <iframe
                src={selectView}
                title="Vista previa archivo"
                className="w-full h-full border rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}