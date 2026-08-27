package com.finora.backend.repository;

import com.finora.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Spring Data generates the query from the method name: joins Transaction -> User
    // and filters by the user's email, ordered by most recent first.
    List<Transaction> findByUserEmailOrderByDateDesc(String email);

    // Used to make sure a user can only fetch/edit/delete their OWN transactions,
    // never someone else's by guessing an id.
    Optional<Transaction> findByIdAndUserEmail(Long id, String email);
}
