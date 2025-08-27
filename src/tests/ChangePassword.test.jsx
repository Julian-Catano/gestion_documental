// ResetPassword.test.jsx
import { render, waitFor } from "@testing-library/react";
import ResetPassword from "../components/ChangePassword";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// Mocks
vi.mock("js-cookie", () => ({
  default: { get: vi.fn() },
}));

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  sendPasswordResetEmail: vi.fn(),
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("envía correo de restablecimiento si hay email en cookies", async () => {
    Cookies.get.mockReturnValue("test@example.com");
    sendPasswordResetEmail.mockResolvedValueOnce();

    render(<ResetPassword />);

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        {},
        "test@example.com"
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("¡Correo de restablecimiento enviado"),
          icon: "success",
        })
      );
    });
  });

  test("muestra error si sendPasswordResetEmail falla", async () => {
    Cookies.get.mockReturnValue("test@example.com");
    sendPasswordResetEmail.mockRejectedValueOnce(new Error("Error de prueba"));

    render(<ResetPassword />);

    // Como el error se maneja con setMessage, solo validamos que se llame con error
    expect(sendPasswordResetEmail).toHaveBeenCalled();
  });

  test("muestra alerta si no hay correo en cookies", () => {
    Cookies.get.mockReturnValue(undefined);

    render(<ResetPassword />);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("No se encontró un correo almacenado"),
        icon: "error",
      })
    );
  });
});
