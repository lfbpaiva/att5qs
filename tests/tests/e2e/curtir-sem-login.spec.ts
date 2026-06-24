import { test, expect } from "@playwright/test";

// E2E 2 - Tentar curtir um post SEM estar autenticado
test("E2E curtir sem login: exibe alerta pedindo autenticação", async ({ page }) => {
  // captura a mensagem do alert() do navegador antes de ele aparecer
  let mensagemDoAlerta = "";
  page.once("dialog", async (dialog) => {
    mensagemDoAlerta = dialog.message();
    await dialog.dismiss();
  });

  // 1. abre a home (feed de posts), sem fazer login
  await page.goto("/");

  // 2. clica em "Curtir" no primeiro post do feed
  await page.getByRole("button", { name: "Curtir" }).first().click();

  // 3. confirma que o sistema bloqueou e pediu autenticação
  await expect
    .poll(() => mensagemDoAlerta)
    .toBe("Você precisa estar autenticado para curtir posts!");
});
