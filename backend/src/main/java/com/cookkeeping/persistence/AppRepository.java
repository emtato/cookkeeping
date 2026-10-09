package com.cookkeeping.persistence;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class AppRepository {

    private final JdbcClient jdbcClient;

    public AppRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    // Add grocery, recipe, and meal-plan SQL methods as their tables are defined.
}
