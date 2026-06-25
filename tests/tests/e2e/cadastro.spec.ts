import { test, expect } from "@playwright/test";


test("E2E cadastro: cria uma conta nova e entra autenticado", async ({ page }) => {
  
  const email = `e2e_${Date.now()}@email.com`;
  const senha = "Senha@123";

  
  await page.goto("/signup");

  
  await page.getByPlaceholder("seu@email.com").fill(email);
  const camposSenha = page.getByPlaceholder("••••••••");
  await camposSenha.nth(0).fill(senha);  
  await camposSenha.nth(1).fill(senha);  

  
  await page.locator('button[type="submit"]').click();

  
  await expect(page).toHaveURL("http://localhost:3000/");


  await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
});
