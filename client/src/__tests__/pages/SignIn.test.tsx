import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({ login: jest.fn() })),
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header" />,
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

import SignIn from "@/app/signin/page";
import { authService } from "@/service/auth/auth";

describe("Página SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve exibir 'Credenciais inválidas' quando API retorna erro 401", async () => {
    const axiosError = new AxiosError("Request failed");
    Object.defineProperty(axiosError, "response", {
      value: {
        data: { message: "Credenciais inválidas" },
        status: 401,
      },
    });
    (authService.signIn as jest.Mock).mockRejectedValue(axiosError);

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "SenhaErrada@1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
    });
  });
});
