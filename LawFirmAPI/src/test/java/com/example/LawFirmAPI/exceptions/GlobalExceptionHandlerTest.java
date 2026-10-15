package com.example.LawFirmAPI.exceptions;

import jakarta.mail.AuthenticationFailedException;
import jakarta.mail.MessagingException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ProblemDetail;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void ConflictException_Returns409AndDomainMessage() {
        ProblemDetail pd = handler.handleConflictException(new ConflictException("username repetido"));

        Assertions.assertThat(pd.getStatus()).isEqualTo(409);
        Assertions.assertThat(pd.getDetail()).isEqualTo("username repetido");
    }

    @Test
    void DataIntegrityViolationException_Returns409DomainMessage(){
        ProblemDetail pd = handler.handleDataIntegrityViolationException(
                new DataIntegrityViolationException("duplicate key value violates unique constraint " +
                        "\"uk_user_email\" Detail: Key (email)=(ana@exemplo.pt) already exists.")
        );

        Assertions.assertThat(pd.getStatus()).isEqualTo(409);
        Assertions.assertThat(pd.getDetail()).doesNotContain("ana@exemplo.pt");
    }

    @Test
    void RuntimeException_Returns500AndDomainMessage(){
        ProblemDetail pd = handler.handleGenericException(new Exception("SQL interno: select * from users"));
        Assertions.assertThat(pd.getStatus()).isEqualTo(500);
        Assertions.assertThat(pd.getDetail()).doesNotContain("SQL");
    }

    @Test
    void MailboxAuthenticationException_Returns422AndDomainMessage(){
        //Arrange
        MessagingException original = new AuthenticationFailedException("[AUTH] Invalid credentials for ana@exemplo.pt");
        MailboxAuthenticationException ex = new MailboxAuthenticationException("Credenciais inválidas",original);

        //Act
        ProblemDetail pd = handler.handleMailboxAuthenticationException(ex);

        //Assert
        Assertions.assertThat(pd.getTitle()).isNotBlank();
        Assertions.assertThat(pd.getStatus()).isEqualTo(422);
        Assertions.assertThat(pd.getDetail()).doesNotContain("ana@exemplo.pt", "[AUTH]");
    }

    @Test
    void MailServerException_Returns502AndDomainMessage(){
        //Arrange
        MessagingException original = new MessagingException("Connection reset by imap.gmail.com:993");
        MailServerException ex = new MailServerException("Falha ao ler a caixa ana@exemplo.pt", original);
        //Act
        ProblemDetail pd = handler.handleMailServerException(ex);

        //Assert
        Assertions.assertThat(pd.getTitle()).isNotBlank();
        Assertions.assertThat(pd.getStatus()).isEqualTo(502);
        Assertions.assertThat(pd.getDetail()).doesNotContain("ana@exemplo.pt","imap.gmail.com");
    }

    @Test
    void UnsupportedMailProviderException_Returns400AndDomainMessage(){
        //Arrange
        UnsupportedMailProviderException ex = new UnsupportedMailProviderException("Fornecedor de e-mail não suportado: só Gmail");

        //Act
        ProblemDetail pd = handler.handleUnsupportedMailProviderException(ex);

        //Assert
        Assertions.assertThat(pd.getTitle()).isNotBlank();
        Assertions.assertThat(pd.getStatus()).isEqualTo(400);
        Assertions.assertThat(pd.getDetail()).isEqualTo("Fornecedor de e-mail não suportado: só Gmail");
    }

    @Test
    void ResourceNotFound_Returns404AndDomainMessage(){
        //Arrange and Act
        ProblemDetail pd = handler.handleResourceNotFoundException(new ResourceNotFound("Recurso longe"));

        //Assert
        Assertions.assertThat(pd.getStatus()).isEqualTo(404);
        Assertions.assertThat(pd.getDetail()).isEqualTo("Recurso longe");
        Assertions.assertThat(pd.getTitle()).isEqualTo("Recurso não encontrado");
    }
}
