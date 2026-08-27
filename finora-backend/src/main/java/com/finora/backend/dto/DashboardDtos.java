package com.finora.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDtos {

    public record CategoryBreakdown(
            String category,
            BigDecimal total
    ) {}

    public record DashboardSummaryResponse(
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal savings,
            // Percentage of income that was saved, e.g. 38.6 means 38.6%.
            // Null when there was no income yet, to avoid a division by zero.
            BigDecimal savingsRate,
            List<CategoryBreakdown> expensesByCategory
    ) {}
}
