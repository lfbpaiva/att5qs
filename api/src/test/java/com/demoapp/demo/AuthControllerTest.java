package com.demoapp.demo;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private UserRepository userRepository;

    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void signup_comDadosValidos_deveRetornar200() throws Exception {
        Map<String, String> body = Map.of(
            "email", "novo@email.com",
            "password", "Senha@1234"
        );

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("novo@email.com"));
    }

    @Test
    void signin_comCredenciaisInvalidas_deveRetornar401ComMensagemCorreta() throws Exception {
        Map<String, String> body = Map.of(
            "email", "naoexiste@email.com",
            "password", "Senha@1234"
        );

        mvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
    }

    
    @Test
    void signup_comEmailDuplicado_deveRetornarMensagemEmailJaCadastrado() throws Exception {
        User usuarioExistente = new User();
        usuarioExistente.setEmail("existente@email.com");
        usuarioExistente.setPassword("Senha@1234");
        userRepository.save(usuarioExistente);

        Map<String, String> body = Map.of(
            "email", "existente@email.com",
            "password", "OutraSenha@1"
        );

        mvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
    }
}
