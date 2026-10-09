package com.cookkeeping.grocery.repository;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class GroceryRepository {

    private final JdbcClient jdbcClient;

    public GroceryRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    // Add grocery-item SQL methods once the table schema is defined.
}
