package com.finora.backend.controller;

import com.finora.backend.dto.TransactionDtos.*;
import com.finora.backend.model.Transaction;
import com.finora.backend.model.User;
import com.finora.backend.repository.TransactionRepository;
import com.finora.backend.repository.UserRepository;
import com.finora.backend.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<TransactionResponse> getAll() {
        String email = SecurityUtils.getCurrentUserEmail();
        return transactionRepository.findByUserEmailOrderByDateDesc(email)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@Valid @RequestBody TransactionRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setCategory(request.category());
        transaction.setDescription(request.description());
        transaction.setDate(request.date());

        Transaction saved = transactionRepository.save(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();

        return transactionRepository.findByIdAndUserEmail(id, email)
                .<ResponseEntity<?>>map(transaction -> {
                    transaction.setAmount(request.amount());
                    transaction.setType(request.type());
                    transaction.setCategory(request.category());
                    transaction.setDescription(request.description());
                    transaction.setDate(request.date());
                    return ResponseEntity.ok(toResponse(transactionRepository.save(transaction)));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Transaction not found."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        String email = SecurityUtils.getCurrentUserEmail();

        return transactionRepository.findByIdAndUserEmail(id, email)
                .<ResponseEntity<?>>map(transaction -> {
                    transactionRepository.delete(transaction);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Transaction not found."));
    }

    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(), t.getAmount(), t.getType(), t.getCategory(), t.getDescription(), t.getDate()
        );
    }
}