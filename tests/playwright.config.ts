import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // pasta onde ficam os testes
  testDir: "./tests",
  // roda os testes em paralelo
  fullyParallel: true,
  // gera um relatório HTML navegável ao final
  reporter: "html",
  use: {
    // URL base do front-end (usada pelo page.goto() nos testes E2E)
    baseURL: "http://localhost:3000",
    // captura um trace quando um teste falha, para ajudar na depuração
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
