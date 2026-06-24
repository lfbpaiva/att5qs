import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header" />,
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    resetPassword: jest.fn(),
  },
}));

import ResetPassword from "@/app/reset-password/page";
import { authService } from "@/service/auth/auth";

describe("Página ResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  
  test("deve exibir mensagem 'E-mail enviado com sucesso' após solicitar reset de senha", async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValue(undefined);

    render(<ResetPassword />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@email.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar email/i }));

    await waitFor(() => {
      expect(screen.getByText("E-mail enviado com sucesso")).toBeInTheDocument();
    });
  });
});
