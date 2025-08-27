"use client";

import { useState } from "react";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileType || !fileName) {
      Swal.fire({
        title: "¡Por favor completa todos los campos requeridos!",
        text: "Tu acción no se pudo realizar",
        icon: "warning",
        timer: 2000,
        confirmButtonText: "OK",
      });
      return;
    }

    if (!user) {
      Swal.fire({
        title: "¡Por favor Inicia sesión!",
        text: "Tu acción no se pudo realizar",
        icon: "error",
        timer: 2000,
        confirmButtonText: "OK",
      });
      return;
    }

    setIsUploading(true);

    try {
      const safeName = selectedFile.name.replaceAll(/[^\w.-]/g, "_");
      const path = `${fileType}/${safeName}`;
      const storageRef = ref(storage, path);

      const metadata = {
        contentType: selectedFile.type,
      };

      await uploadBytes(storageRef, selectedFile, metadata);

      const publicUrl = await getDownloadURL(storageRef); // ✅ obtener URL segura automáticamente

      const fileRef = doc(collection(db, "tbl_files"));
      const idFile = fileRef.id;

      await setDoc(fileRef, {
        idFile,
        name: fileName,
        idTypeFile: fileType,
        description,
        creationDate: serverTimestamp(),
        modificationDate: null,
        creationIdUser: user.uid,
        creationEmailUser: user.email,
        modificationIdUser: null,
        path,
        url: publicUrl,
      });

      setSelectedFile(null);
      setFileType("");
      setFileName("");
      setDescription("");

      Swal.fire({
        title: "Archivo subido exitosamente!",
        text: "Tu acción se realizó con éxito",
        icon: "success",
        timer: 2000,
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error al subir archivo:", error);
      Swal.fire({
        title: "Error al subir el archivo",
        text: "Tu acción no se pudo realizar",
        icon: "error",
        timer: 2000,
        confirmButtonText: "OK",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <Card className="border-l-4 border-l-green-600">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="folder-select">Carpeta de almacenamiento</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger id="folder-select">
                <SelectValue placeholder="Selecciona una carpeta" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-name">Nombre del archivo</Label>
            <Input
              id="file-name"
              placeholder="Ingresa el nombre del archivo"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Archivo</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 text-gray-400">
                  <Upload className="w-full h-full" />
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    Examinar
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.pptx,.jpg"
                  />
                  {selectedFile && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600 mt-2 break-all">
                      <FileText className="w-4 h-4" />
                      <span>{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !fileType || !fileName || isUploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isUploading ? "Cargando..." : "Cargar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
