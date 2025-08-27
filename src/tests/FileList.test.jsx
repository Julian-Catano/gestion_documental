// FileList.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileList from "../components/FileList";
import Cookies from "js-cookie";
import { vi } from "vitest";

// --- MOCKS ---
vi.mock("../../firebase", () => ({
  db: {},
}));

// Mock Firestore
vi.mock("firebase/firestore", () => {
  const onSnapshot = vi.fn();
  return {
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot,
    __esModule: true,
    _onSnapshotMock: onSnapshot, // referencia al mock
  };
});

// Mock Firebase Storage
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getMetadata: vi.fn(),
}));

// Mock Cookies
vi.mock("js-cookie", () => ({
  __esModule: true,
  default: { get: vi.fn() },
  get: vi.fn(),
}));

// Mock FileUpload
vi.mock("@/components/FileUpload", () => ({
  default: () => <div>FileUploadMock</div>,
}));

// --- TESTS ---
describe("Componente FileList", () => {
  let onSnapshotMock;

  beforeEach(async () => {
    vi.clearAllMocks();
    const firestore = await import("firebase/firestore");
    onSnapshotMock = firestore._onSnapshotMock;
  });

  test("muestra mensaje cuando no hay archivos disponibles", async () => {
    onSnapshotMock.mockImplementationOnce((q, callback) => {
      callback({ docs: [] });
      return () => {};
    });

    render(<FileList />);
    expect(await screen.findByText(/No hay archivos disponibles/i)).toBeInTheDocument();
  });

  test("muestra un archivo en la tabla cuando firestore devuelve datos", async () => {
    onSnapshotMock.mockImplementationOnce((q, callback) => {
      callback({
        docs: [
          {
            id: "1",
            data: () => ({
              name: "Documento de prueba",
              idTypeFile: "1. Asignación de una persona que diseñe e implemente SST",
              description: "Un archivo de prueba",
              creationDate: { toDate: () => new Date("2023-01-01") },
              creationEmailUser: "test@example.com",
              path: "test.docx",
              url: "http://example.com/test.docx",
            }),
          },
        ],
      });
      return () => {};
    });

    render(<FileList />);
    expect(await screen.findByText(/Documento de prueba/i)).toBeInTheDocument();
  });

  test("permite buscar un archivo", async () => {
    Cookies.get.mockReturnValue("administrador");

    onSnapshotMock.mockImplementationOnce((q, callback) => {
      callback({
        docs: [
          {
            id: "1",
            data: () => ({
              name: "Documento de prueba",
              idTypeFile: "1. Asignación de una persona que diseñe e implemente SST",
              description: "Un archivo de prueba",
              creationDate: { toDate: () => new Date("2023-01-01") },
              creationEmailUser: "test@example.com",
              path: "test.docx",
              url: "http://example.com/test.docx",
            }),
          },
        ],
      });
      return () => {};
    });

    render(<FileList />);

    const input = await screen.findByPlaceholderText(/Buscar archivo/i);
    fireEvent.change(input, { target: { value: "documento" } });

    await waitFor(() => {
      expect(screen.getByText("Documento de prueba")).toBeInTheDocument();
    });
  });

  test("abre el modal de subida de archivos al hacer click en 'Nuevo'", async () => {
    onSnapshotMock.mockImplementationOnce((q, callback) => {
      callback({ docs: [] });
      return () => {};
    });

    render(<FileList />);
    fireEvent.click(screen.getByText(/Nuevo/i));
    expect(await screen.findByText(/Subir archivo/i)).toBeInTheDocument();
  });

  test("permite seleccionar y ver un archivo", async () => {
    Cookies.get.mockReturnValue("administrador");

    onSnapshotMock.mockImplementationOnce((q, callback) => {
      callback({
        docs: [
          {
            id: "1",
            data: () => ({
              name: "Documento de prueba",
              idTypeFile: "1. Asignación de una persona que diseñe e implemente SST",
              description: "Un archivo de prueba",
              creationDate: { toDate: () => new Date("2023-01-01") },
              creationEmailUser: "test@example.com",
              path: "test.docx",
              url: "http://example.com/test.docx",
            }),
          },
        ],
      });
      return () => {};
    });

    render(<FileList />);

    const checkbox = await screen.findByRole("checkbox");
    fireEvent.click(checkbox);

    const verButton = screen.getByText(/Ver/i);
    fireEvent.click(verButton);

    expect(await screen.findByTitle(/Vista previa/i)).toBeInTheDocument();
  });
});
