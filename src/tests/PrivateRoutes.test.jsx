import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PrivateRoutes } from "../components/PrivateRoutes";
import { onAuthStateChanged, setPersistence } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";

// --- Mocks ---
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  setPersistence: vi.fn(),
  browserLocalPersistence: {},
  getAuth: vi.fn(() => ({})),
  auth: {},
}));

vi.mock("js-cookie", () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("PrivateRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setPersistence.mockResolvedValue();
  });

  it("muestra loader mientras carga", () => {
    onAuthStateChanged.mockImplementation(() => {});

    render(
      <MemoryRouter>
        <PrivateRoutes>
          <div>Contenido protegido</div>
        </PrivateRoutes>
      </MemoryRouter>
    );

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("redirige a /login si no hay usuario", async () => {
    onAuthStateChanged.mockImplementation((auth, cb) => {
      cb(null);
      return vi.fn();
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <PrivateRoutes>
          <div>Contenido protegido</div>
        </PrivateRoutes>
      </MemoryRouter>
    );

    expect(await screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });
});
