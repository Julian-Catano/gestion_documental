// MisDatos.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MisDatos from "../components/CardProfile";

// Mock de Firebase
vi.mock("../../firebase", () => ({
  auth: { currentUser: { uid: "123" } },
  db: {},
}));

// Mock de Firestore
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({
      email: "test@example.com",
      creationDate: { toDate: () => new Date("2023-01-01") },
      role: "admin",
      status: "activo",
    }),
  }),
  updateDoc: vi.fn(),
}));

// Mock de navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Componente MisDatos", () => {
  test("permite activar edición de campos", async () => {
    render(
      <MemoryRouter>
        <MisDatos />
      </MemoryRouter>
    );

    const emailInput = await screen.findByDisplayValue("test@example.com");

    expect(emailInput).toHaveAttribute("readonly");

    fireEvent.click(screen.getByText("MIS DATOS"));
  });

  test("redirige al historial de archivos al hacer click", async () => {
    render(
      <MemoryRouter>
        <MisDatos />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Historial de archivos/i));
    expect(mockNavigate).toHaveBeenCalledWith("/MineFiles");
  });
});
