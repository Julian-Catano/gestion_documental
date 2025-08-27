import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ResetPassword from "../components/ResetPassword";

// --- Mocks ---
// --- Mocks ---
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));


import { sendPasswordResetEmail } from "firebase/auth";
import Swal from "sweetalert2";

describe("ResetPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza input y botón", () => {
    render(<ResetPassword />);
    expect(
      screen.getByPlaceholderText("Correo electrónico")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Recuperar contraseña/i })
    ).toBeInTheDocument();
  });

  test("envía correo exitosamente", async () => {
    sendPasswordResetEmail.mockResolvedValueOnce();

    render(<ResetPassword />);
    const input = screen.getByPlaceholderText("Correo electrónico");
    const button = screen.getByRole("button", { name: /Recuperar contraseña/i });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, "test@example.com");
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Correo enviado",
        text: "Revisa tu bandeja de entrada o carpeta de spam.",
        icon: "success",
      });
    });
  });

  test("muestra error si falla", async () => {
    sendPasswordResetEmail.mockRejectedValueOnce({
      code: "auth/user-not-found",
      message: "Usuario no encontrado",
    });

    render(<ResetPassword />);
    const input = screen.getByPlaceholderText("Correo electrónico");
    const button = screen.getByRole("button", { name: /Recuperar contraseña/i });

    fireEvent.change(input, { target: { value: "fail@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Error",
        text: "Usuario no encontrado",
        icon: "error",
      });
    });
  });
});
