import { test, expect } from "@playwright/test";


test("E2E curtir sem login: exibe alerta pedindo autenticação", async ({ page }) => {
  
  let mensagemDoAlerta = "";
  page.once("dialog", async (dialog) => {
    mensagemDoAlerta = dialog.message();
    await dialog.dismiss();
  });

  
  await page.goto("/");

  
  await page.getByRole("button", { name: "Curtir" }).first().click();


  await expect
    .poll(() => mensagemDoAlerta)
    .toBe("Você precisa estar autenticado para curtir posts!");
});
