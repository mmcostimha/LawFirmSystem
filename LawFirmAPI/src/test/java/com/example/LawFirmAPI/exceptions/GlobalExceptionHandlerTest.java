package com.example.LawFirmAPI.exceptions;

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
    void ResourceNotFound_Returns404AndDomainMessage(){
        ProblemDetail pd = handler.handleResourceNotFoundException(new ResourceNotFound("Recurso longe"));
        Assertions.assertThat(pd.getStatus()).isEqualTo(404);
        Assertions.assertThat(pd.getDetail()).isEqualTo("Recurso longe");
        Assertions.assertThat(pd.getTitle()).isEqualTo("Recurso não encontrado");
    }
}
