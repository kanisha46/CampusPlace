package com.campusplace.exception;

import com.campusplace.dto.ApiResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ApiResponse handleRuntime(RuntimeException ex) {
        return new ApiResponse(ex.getMessage());
    }
}