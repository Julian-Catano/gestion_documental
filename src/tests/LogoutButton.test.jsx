import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogoutButton from "../components/LogoutButton";
import { vi } from "vitest";
import Cookies from "js-cookie";

// --- MOCKS ---
vi.mock("firebase/auth", () => ({
  signOut: vi.fn(() => Promise.resolve()),
}));
vi.mock("../../firebase", () => ({
  auth: { mock: true },
}));

// mock de navigate de react-router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// mock Cookies
// mock Cookies
vi.mock("js-cookie", () => {
  return {
    __esModule: true,
    default: {
      remove: vi.fn(),
    },
  };
});


describe("LogoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("dummy", "value"); // simula data en localStorage
  });

  it("renderiza el botón", () => {
    render(<LogoutButton />);
    expect(
      screen.getByRole("button", { name: /cerrar sesión/i })
    ).toBeInTheDocument();
  });

  it("ejecuta logout correctamente", async () => {
    render(<LogoutButton />);

    const btn = screen.getByRole("button", { name: /cerrar sesión/i });
    fireEvent.click(btn);

    const { signOut } = await import("firebase/auth");

    await waitFor(() => {
      // se llamó signOut con auth
      expect(signOut).toHaveBeenCalledWith(expect.any(Object));

      // cookies eliminadas
      expect(Cookies.remove).toHaveBeenCalledWith("userEmail");
      expect(Cookies.remove).toHaveBeenCalledWith("userId");
      expect(Cookies.remove).toHaveBeenCalledWith("userRol");
      expect(Cookies.remove).toHaveBeenCalledWith("token");

      // localStorage limpiado
      expect(localStorage.getItem("dummy")).toBeNull();

      // redirección a /login
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
