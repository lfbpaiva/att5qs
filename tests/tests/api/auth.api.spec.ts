import { test, expect } from "@playwright/test";

 
const API = "http://localhost:8080";

const SENHA_VALIDA = "Senha@123";

test.describe("API /auth - testes de caixa-preta", () => {
  
  test("POST /auth/signup com dados válidos retorna 200 e o e-mail criado", async ({ request }) => {
    const email = `novo_${Date.now()}@email.com`;

    const res = await request.post(`${API}/auth/signup`, {
      data: { email, password: SENHA_VALIDA },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.email).toBe(email);
  });

  
  test("POST /auth/signin com credenciais inválidas retorna 401", async ({ request }) => {
    const res = await request.post(`${API}/auth/signin`, {
      data: { email: `naoexiste_${Date.now()}@email.com`, password: SENHA_VALIDA },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.message).toBe("Credenciais inválidas");
  });

  
  test("POST /auth/signup com e-mail duplicado retorna 409", async ({ request }) => {
    const email = `duplicado_${Date.now()}@email.com`;

    
    const primeiro = await request.post(`${API}/auth/signup`, {
      data: { email, password: SENHA_VALIDA },
    });
    expect(primeiro.status()).toBe(200);

    
    const segundo = await request.post(`${API}/auth/signup`, {
      data: { email, password: SENHA_VALIDA },
    });
    expect(segundo.status()).toBe(409);
  });

  
  test("POST /auth/signup com senha inválida retorna 422", async ({ request }) => {
    const res = await request.post(`${API}/auth/signup`, {
      data: { email: `senhafraca_${Date.now()}@email.com`, password: "123" },
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.message).toBe("Senha inválida");
  });
});
