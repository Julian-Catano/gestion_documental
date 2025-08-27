// LoginForm.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "../components/Login";

// Mock de Firebase
vi.mock("../../firebase", () => ({
  auth: { currentUser: { uid: "123" } },
  db: {},
}));

// Mock de Firestore (aunque aquí casi no se usa, lo dejamos igual por consistencia)
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

// Mock de navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("Componente LoginForm", () => {
  test("muestra el botón de iniciar sesión", () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
  });

  test("permite escribir en el campo de email", () => {
    renderWithRouter(<LoginForm />);
    const emailInput = screen.getByPlaceholderText(/correo/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  test("permite escribir en el campo de contraseña", () => {
    renderWithRouter(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    expect(passwordInput.value).toBe("123456");
  });

  test("permite seleccionar un rol", () => {
    renderWithRouter(<LoginForm />);
    const selectRol = screen.getByRole("combobox");
    fireEvent.change(selectRol, { target: { value: "usuario" } });
    expect(selectRol.value).toBe("usuario");
  });

  test("muestra el modal de reset password al hacer click en 'Olvidé mi contraseña'", () => {
    renderWithRouter(<LoginForm />);
    fireEvent.click(screen.getByText(/Olvidé mi contraseña/i));
    expect(screen.getByText("✕")).toBeInTheDocument();
  });
});
