import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUpload from "../components/FileUpload";
import { vi } from "vitest";
import Swal from "sweetalert2"; // se mantiene, pero ya no lo espiamos

// Para poder hacer asserts sobre las llamadas
import * as storageApi from "firebase/storage";
import * as firestoreApi from "firebase/firestore";

// --- MOCKS ---
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({ mock: true })),
  ref: vi.fn(() => "mock-ref"),
  uploadBytes: vi.fn(() => Promise.resolve()),
  getDownloadURL: vi.fn(() => Promise.resolve("http://mock-url.com/file.pdf")),
}));

vi.mock("../../firebase", () => ({
  storage: { mock: true },
  db: { mock: true },
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "mock-collection"),
  addDoc: vi.fn(() => Promise.resolve({ id: "123" })),
  serverTimestamp: vi.fn(() => "mock-timestamp"),
  doc: vi.fn(() => ({ id: "mock-doc-id" })), // id estable para el assert
  setDoc: vi.fn(() => Promise.resolve()),
}));

vi.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: { uid: "user-123", email: "test@example.com" },
  }),
}));

// Mock SweetAlert2 (no lo espiamos en la prueba de éxito)
vi.mock("sweetalert2", () => {
  const fire = vi.fn();
  return {
    __esModule: true,
    default: { fire },
  };
});

// Mock shadcn/ui
vi.mock("@/components/ui/button", () => ({
  Button: (props) => <button {...props}>{props.children}</button>,
}));
vi.mock("@/components/ui/input", () => ({
  Input: (props) => <input {...props} />,
}));
vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props) => <textarea {...props} />,
}));
vi.mock("@/components/ui/select", () => {
  const Select = ({ children, onValueChange }) => (
    <select onChange={(e) => onValueChange(e.target.value)}>{children}</select>
  );
  const SelectContent = ({ children }) => <>{children}</>;
  const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
  );
  return {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger: ({ children }) => <>{children}</>,
    SelectValue: ({ placeholder }) => <>{placeholder}</>,
  };
});
vi.mock("@/components/ui/card", () => ({
  Card: (props) => <div {...props} />,
  CardContent: (props) => <div {...props} />,
}));
vi.mock("@/components/ui/label", () => ({
  Label: (props) => <label {...props} />,
}));
vi.mock("lucide-react", () => ({
  Upload: () => <span>UploadIcon</span>,
  FileText: () => <span>FileIcon</span>,
}));

// --- TESTS ---
describe("FileUpload component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente los inputs", () => {
    render(<FileUpload />);
    expect(screen.getByLabelText(/Nombre del archivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByText(/Cargar/i)).toBeDisabled();
  });

  it("permite seleccionar archivo y reflejarlo en el input", () => {
    const { container } = render(<FileUpload />);

    fireEvent.change(screen.getByLabelText(/Nombre del archivo/i), {
      target: { value: "test.pdf" },
    });

    const fileInput = container.querySelector("#file-input");
    const file = new File(["contenido"], "mock.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0].name).toBe("mock.pdf");
  });

  it("no permite subir archivo si faltan campos", () => {
    render(<FileUpload />);

    const uploadBtn = screen.getByText(/Cargar/i);
    expect(uploadBtn).toBeDisabled();
    // opcional: que no haya alerta
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it("sube el archivo y persiste metadatos en Firestore", async () => {
    const { container } = render(<FileUpload />);

    // Usa el valor EXACTO de la opción del Select
    const folder =
      "1. Asignación de una persona que diseñe e implemente SST";
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: folder },
    });

    fireEvent.change(screen.getByLabelText(/Nombre del archivo/i), {
      target: { value: "archivo-prueba" },
    });

    fireEvent.change(screen.getByLabelText(/Descripción/i), {
      target: { value: "descripcion de prueba" },
    });

    const fileInput = container.querySelector("#file-input");
    const file = new File(["contenido"], "mock.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // click en subir
    fireEvent.click(screen.getByText(/Cargar/i));

    // Espera a que se haya guardado en Firestore
    await waitFor(() => {
      expect(firestoreApi.setDoc).toHaveBeenCalledTimes(1);
    });

    // Aserciones sobre llamadas a storage
    expect(storageApi.ref).toHaveBeenCalledWith(
      expect.anything(), // storage
      `${folder}/mock.pdf`
    );
    expect(storageApi.uploadBytes).toHaveBeenCalledWith(
      "mock-ref",
      file,
      expect.objectContaining({ contentType: "application/pdf" })
    );
    expect(storageApi.getDownloadURL).toHaveBeenCalledWith("mock-ref");

    // Aserción sobre el payload guardado en Firestore
    const [, payload] = firestoreApi.setDoc.mock.calls[0];
    expect(payload).toEqual(
      expect.objectContaining({
        idFile: "mock-doc-id",
        name: "archivo-prueba",
        idTypeFile: folder,
        description: "descripcion de prueba",
        path: `${folder}/mock.pdf`,
        url: "http://mock-url.com/file.pdf",
        creationIdUser: "user-123",
        creationEmailUser: "test@example.com",
        modificationIdUser: null,
        modificationDate: null,
        // creationDate es "mock-timestamp" por el mock de serverTimestamp
        creationDate: "mock-timestamp",
      })
    );
  });
});
