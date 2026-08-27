package com.finora.backend.dto;

import com.finora.backend.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDtos {

    public record TransactionRequest(
            @NotNull @DecimalMin(value = "0.01", message = "Amount must be greater than 0") BigDecimal amount,
            @NotNull TransactionType type,
            @NotBlank String category,
            String description,
            @NotNull LocalDate date
    ) {}

    public record TransactionResponse(
            Long id,
            BigDecimal amount,
            TransactionType type,
            String category,
            String description,
            LocalDate date
    ) {}
}
