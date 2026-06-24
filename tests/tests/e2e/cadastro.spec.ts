import { test, expect } from "@playwright/test";

// E2E 1 - Fluxo completo de cadastro de um novo usuário
test("E2E cadastro: cria uma conta nova e entra autenticado", async ({ page }) => {
  // e-mail único a cada execução, para nunca dar conflito de duplicado
  const email = `e2e_${Date.now()}@email.com`;
  const senha = "Senha@123";

  // 1. abre a página de cadastro
  await page.goto("/signup");

  // 2. preenche o formulário como um usuário real faria
  await page.getByPlaceholder("seu@email.com").fill(email);
  const camposSenha = page.getByPlaceholder("••••••••");
  await camposSenha.nth(0).fill(senha); // campo "Senha"
  await camposSenha.nth(1).fill(senha); // campo "Confirmar Senha"

  // 3. clica no botão de enviar (submit) do formulário
  await page.locator('button[type="submit"]').click();

  // 4. após o cadastro, o sistema redireciona para a home
  await expect(page).toHaveURL("http://localhost:3000/");

  // 5. e o cabeçalho passa a mostrar o botão "Sair" (usuário autenticado)
  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
});
