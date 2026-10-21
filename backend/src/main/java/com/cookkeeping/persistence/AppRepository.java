package com.cookkeeping.persistence;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.GroceryItem;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.SqlArrayValue;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class AppRepository {

    private final JdbcClient jdbcClient;

    public AppRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    // Add grocery, recipe, and meal-plan SQL methods as their tables are defined.

    public long countItems() { //test to connect db to java backend
        return jdbcClient.sql("SELECT COUNT(*) FROM grocery_items")
                .query(Long.class)
                .single();
    }

    public void addGroceryItem(AddGroceryItemRequest request) {
        LocalDate[] needDates = request.needDate() == null ? new LocalDate[0] : request.needDate();

        jdbcClient.sql("""
                        INSERT INTO grocery_items (name, quantity, unit, category, note, checked, need_date)
                        VALUES (:name, :quantity, :unit, :category, :note, :checked, :needDate)
                        """)// define what input to insert and values, where the variables :name etc are attached by the .param
                .param("name", request.name())
                .param("quantity", request.quantity())
                .param("unit", request.unit())
                .param("category", request.category())
                .param("note", request.note())
                .param("checked", request.checked())
                .param("needDate", new SqlArrayValue("date", (Object[]) needDates))
                .update();
    }

    public void updateGroceryItem(UpdateGroceryItemRequest request) {
        jdbcClient.sql("""
                DELETE FROM items
                WHERE id = :id;""").param("id", request.id).update();

        //can modify in place instead of deleting and re adding?
        LocalDate[] needDates = request.needDate() == null ? new LocalDate[0] : request.needDate();
        jdbcClient.sql("""
                        INSERT INTO grocery_items (id, name, quantity, unit, category, note, checked, need_date)
                        VALUES (:id, :name, :quantity, :unit, :category, :note, :checked, :needDate)
                        """).param("id", request.id())
                .param("name", request.name())
                .param("quantity", request.quantity())
                .param("unit", request.unit())
                .param("category", request.category())
                .param("note", request.note())
                .param("checked", request.checked())
                .param("needDate", new SqlArrayValue("date", (Object[]) needDates))
                .update();
    }

    public void deleteGroceryItem(int id) {
        jdbcClient.sql("""
                DELETE FROM items
                WHERE id = :id;""").param("id", id).update();
    }

    public List<GroceryItem> getGroceryItems(LocalDate startDate, LocalDate endDate) {
        jdbcClient.sql("""
                SELECT * FROM grocery_items
                WHERE need_date >= :startDate AND need_date <= :endDate;""").param("startDate", startDate).param("endDate", endDate).query();
        return List.of();
    } //select all items in db, then filter by date range


}

