package com.example.LawFirmAPI.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;
import java.time.Instant;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        pd.setProperty("timestamp", Instant.now());
        return pd;
    }

    @ExceptionHandler(ResourceNotFound.class)
    public ProblemDetail handleResourceNotFoundException(ResourceNotFound ex){
        return problem(HttpStatus.NOT_FOUND,"Recurso não encontrado",ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflictException(ConflictException ex){
        return problem(HttpStatus.CONFLICT,"Recurso duplicado",ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrityViolationException(DataIntegrityViolationException ex){
        log.warn(ex.getMessage());
        return problem(HttpStatus.CONFLICT, "Recurso duplicado", "O recurso já existe");
    }

    @ExceptionHandler(MailboxAuthenticationException.class)
    public ProblemDetail handleMailboxAuthenticationException(MailboxAuthenticationException ex){
        log.warn("Erro nas credenciais de autenticacao: {}", ex.getMessage());

        return problem(HttpStatus.UNPROCESSABLE_ENTITY, "Credenciais da caixa de correio inválidas", "Credenciais inválidas");
    }

    @ExceptionHandler(MailServerException.class)
    public ProblemDetail handleMailServerException(MailServerException ex){
        log.warn("Erro na comunicacao com o servidor:", ex);

        return problem(HttpStatus.BAD_GATEWAY, "Servidor de e-mail indisponível.", "Falha ao ler uma caixa");
    }

    @ExceptionHandler(UnsupportedMailProviderException.class)
    public ProblemDetail handleUnsupportedMailProviderException(UnsupportedMailProviderException ex){
        log.warn("Fornecedor de e-mail não suportado: {}", ex.getMessage());

        return problem(HttpStatus.BAD_REQUEST, "Fornecedor de email não suportado.", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception  ex){
        log.error("Erro não tratado: ",ex);

        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor", "Ocorreu um erro inesperado.");

    }
}
