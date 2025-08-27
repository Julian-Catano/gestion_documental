import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TablaArchivos from "../components/MineFiles";
import { vi } from "vitest";
import { getDocs } from "firebase/firestore";

// --- Mocks Firebase Firestore ---
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    startAfter: vi.fn(),
    getDocs: vi.fn(() =>
      Promise.resolve({
        docs: [
          {
            id: "1",
            data: () => ({
              name: "Archivo 1",
              description: "Descripción 1",
              creationDate: { toDate: () => new Date("2024-01-01") },
            }),
          },
        ],
      })
    ),
  };
});

// --- Mocks Firebase Auth ---
vi.mock("firebase/auth", () => {
  return {
    onAuthStateChanged: (auth, cb) => {
      cb({ uid: "mockUser" });
      return vi.fn();
    },
  };
});

// --- Mock firebase config ---
vi.mock("../../firebase", () => ({
  auth: {},
  db: {},
}));

// --- Mocks jsPDF y autoTable ---
const saveMock = vi.fn();
vi.mock("jspdf", () => {
  return {
    __esModule: true,
    default: vi.fn(() => ({
      text: vi.fn(),
      save: saveMock,
    })),
  };
});
vi.mock("jspdf-autotable", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("TablaArchivos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra los archivos en la tabla después de cargar", async () => {
    render(<TablaArchivos />);

    const row = await screen.findByText("Archivo 1");
    expect(row).toBeInTheDocument();

    expect(row.closest("tr")).toHaveTextContent("Descripción 1");

    expect(row.closest("tr")).toHaveTextContent(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  it("descarga el PDF cuando se hace click en Descargar", async () => {
    render(<TablaArchivos />);

    const btn = await screen.findByText(/Descargar/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledWith("HistorialArchivos.pdf");
    });
  });

  it("muestra 'No hay más archivos' si no existe lastDoc", async () => {
    getDocs.mockResolvedValueOnce({ docs: [] }); // 👈 simulamos que no hay archivos

    render(<TablaArchivos />);

    expect(await screen.findByText(/No hay más archivos/i)).toBeInTheDocument();
  });
});
