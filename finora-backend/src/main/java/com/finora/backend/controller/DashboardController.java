package com.finora.backend.controller;

import com.finora.backend.dto.DashboardDtos.*;
import com.finora.backend.model.Transaction;
import com.finora.backend.model.TransactionType;
import com.finora.backend.repository.TransactionRepository;
import com.finora.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TransactionRepository transactionRepository;

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        String email = SecurityUtils.getCurrentUserEmail();
        List<Transaction> transactions = transactionRepository.findByUserEmailOrderByDateDesc(email);

        BigDecimal totalIncome = sumByType(transactions, TransactionType.INCOME);
        BigDecimal totalExpenses = sumByType(transactions, TransactionType.EXPENSE);
        BigDecimal savings = totalIncome.subtract(totalExpenses);

        BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
                ? savings.divide(totalIncome, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(1, RoundingMode.HALF_UP)
                : null;

        List<CategoryBreakdown> byCategory = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .map(e -> new CategoryBreakdown(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(CategoryBreakdown::total).reversed())
                .toList();

        return new DashboardSummaryResponse(totalIncome, totalExpenses, savings, savingsRate, byCategory);
    }

    private BigDecimal sumByType(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(t -> t.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
