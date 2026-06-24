import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";

describe("Header", () => {
  test("deve exibir botões Entrar e Criar Conta para usuário não autenticado", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
    expect(screen.queryByText("Posts Curtidos")).not.toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
  });

  test("deve exibir botões Posts Curtidos e Sair para usuário autenticado", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText("Posts Curtidos")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
    expect(screen.queryByText("Criar Conta")).not.toBeInTheDocument();
  });
});
