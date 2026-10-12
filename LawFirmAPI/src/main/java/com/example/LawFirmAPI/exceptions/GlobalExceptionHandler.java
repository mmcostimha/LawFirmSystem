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

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception  ex){
        log.error("Excepcao gernerica: ",ex);

        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Erro não tratado", "Ocorreu um erro inesperado. Tente novamente mais tarde.");

    }
}
