import { render, screen, fireEvent } from "@testing-library/react";
import UserDropdown from "../components/MenuUser";
import LogoutButton from "../components/LogoutButton";
import { vi } from "vitest";

// mock lucide-react
vi.mock("lucide-react", () => ({
  User: (props) => <svg {...props} data-testid="user-icon" />,
  Settings: (props) => <svg {...props} data-testid="settings-icon" />,
}));

// mock LogoutButton
vi.mock("../components/LogoutButton", () => ({
  __esModule: true,
  default: () => <button>Mock Logout</button>,
}));

describe("UserDropdown", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza el botón de perfil y el de logout", () => {
    render(<UserDropdown />);
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Logout/i)).toBeInTheDocument();
  });

  it("redirige al perfil cuando se hace click en el botón Perfil", () => {
    delete window.location;
    window.location = { href: "" };

    render(<UserDropdown />);
    fireEvent.click(screen.getByText(/Perfil/i));

    expect(window.location.href).toBe("/Profile");
  });

  it("incluye el LogoutButton", () => {
    render(<UserDropdown />);
    expect(screen.getByText(/Mock Logout/i)).toBeInTheDocument();
  });
});
