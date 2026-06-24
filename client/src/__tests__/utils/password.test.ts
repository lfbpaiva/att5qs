import { isPasswordValid, getPasswordValidationMessage } from "@/utils/password";

describe("isPasswordValid", () => {
  test("deve retornar true para uma senha forte com 9+ caracteres", () => {
    expect(isPasswordValid("Senha@1234")).toBe(true);
  });

 
  test("deve retornar true para uma senha com exatamente 8 caracteres válidos", () => {
    expect(isPasswordValid("Senha@1A")).toBe(true);
  });
});

describe("getPasswordValidationMessage", () => {
  test("deve retornar string vazia para senha forte", () => {
    expect(getPasswordValidationMessage("Senha@1234")).toBe("");
  });

  test("deve retornar mensagem de erro para senha sem caractere especial", () => {
    const msg = getPasswordValidationMessage("SenhaAbc1");
    expect(msg).toContain("caractere especial");
  });
});
