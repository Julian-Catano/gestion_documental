"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getMetadata } from "firebase/storage";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const q = query(collection(db, "tbl_files"), orderBy("creationDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fileList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
      const bucketName = "gestiondocumental-ff0fd";
      const filePath = file.path || "default.docx";
      const encodedPath = encodeURIComponent(filePath);
      const publicUrl = file.url;
      setSelectView(publicUrl);
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === "Todos" || file.idTypeFile === selectedFolder;
    const matchesUser = selectedUser ? file.user === selectedUser : true;
    return matchesSearch && matchesFolder && matchesUser;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredFiles.length / rowsPerPage);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((page) => Math.max(page - 1, 1));
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <Card className="mb-4">
        <CardHeader className="flex flex-col md:flex-block justify-between gap-4">
          <CardTitle className="text-xl">Gestión de Archivos</CardTitle>
          <div className="flex flex-wrap gap-2">

            <div className="flex md:flex-row gap-2">
              <Select onValueChange={setSelectedUser}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filtrar usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario1">Usuario 1</SelectItem>
                  <SelectItem value="usuario2">Usuario 2</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setSelectedFolder} value={selectedFolder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar carpeta" />
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar archivo..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* botones */}

            <div className="flex md:flex-row gap-2">
              <Button onClick={handleViewFile} disabled={selectedFiles.size !== 1} variant="outline">
                <Eye className="w-4 h-4 mr-2" /> Ver
              </Button>

              <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 text-white hover:bg-green-700 text-sm font-medium px-4 py-2 rounded-md shadow">
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-md p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Subir archivo</h2>
                  <FileUpload />
                </DialogContent>
              </Dialog>

            </div>

          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">✓</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No hay archivos disponibles.
                  </TableCell>
                </TableRow>
              ) : (
                currentFiles.map((file) => (
                  <TableRow key={file.id} className={selectedFiles.has(file.id) ? "bg-accent" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.has(file.id)}
                        onCheckedChange={(checked) => handleSelectFile(file.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="truncate max-w-[120px]">{file.id}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{file.name}</TableCell>
                    <TableCell className="truncate max-w-[180px]">{file.idTypeFile}</TableCell>
                    <TableCell className="truncate max-w-[300px]">{file.description}</TableCell>
                    <TableCell className="w-[120px]">
                      {file.creationDate?.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell className="truncate max-w-[150px]">{file.creationEmailUser}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Button onClick={goToPrevPage} disabled={currentPage === 1} variant="outline" size="sm">
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
            <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {viewingFile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] overflow-auto relative">
            <button
              onClick={() => {
                setViewingFile(null);
                setSelectView("");
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="mb-2 text-lg font-semibold px-4 pt-4">{viewingFile.name}</h3>
            <iframe
              src={
                viewingFile.name?.match(/\.(docx?|xlsx?|pptx?)$/i)
                  ? `https://docs.google.com/gview?url=${encodeURIComponent(selectView)}&embedded=true`
                  : selectView
              }
              title="Vista previa"
              className="w-full h-full border-t"
            />
          </div>
        </div>
      )}
    </div>
  );
}
