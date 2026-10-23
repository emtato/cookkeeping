package com.cookkeeping.persistence;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.DisplayGroceryItem;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.SqlArrayValue;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
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
        LocalDate[] needDates = request.needDate() == null ? new LocalDate[0] : request.needDate();

        jdbcClient.sql("""
                UPDATE grocery_items
                SET name = :name, quantity = :quantity, unit = :unit, category = :category, note = :note, checked = :checked, need_date = :needDate
                WHERE id = :id;""").param("id", request.id()).update();
    }

    public void deleteGroceryItem(int id) {
        jdbcClient.sql("""
                DELETE FROM grocery_items
                WHERE id = :id;""").param("id", id).update();
    }

    public List<DisplayGroceryItem> getGroceryItems(LocalDate startDate, LocalDate endDate) {
        //IMPORTANT LOGIC DECISION,  TODO to potentially change later
        /*
           currently, need date stored in db is an array of dates: which dates need this ingredient. for now, we will assume
           things bought 2 weeks in advance won't expire; therefore, to prevent having to buy the same thing in small quantities each time,
           if something is within startdate and enddate, we will return the additional quantity/unit necessary for the next subsequent if its within
           2 weeks.
           the displayed needmeals on the ui would show this info.
           also, things like butter, ketchup, canned stuff etc shouldnt ever be delayed later, (unlike perishables) so any
           manually added / recipe added thing should be aggregated to be bought all together at once.
        */

        ArrayList<DisplayGroceryItem> dbGroceriesResult;
        /*
        unnest(need_date) turns the array into individual date rows
        EXISTS is true if at least one of those rows passes the test.
        */
        dbGroceriesResult = (ArrayList<DisplayGroceryItem>) jdbcClient.sql("""
                  SELECT grocery_items.*,
                         NULL::integer AS displayquantity,
                         NULL::integer[] AS displayneedmeals
                  FROM grocery_items
                  WHERE EXISTS (
                      SELECT 1
                      FROM unnest(need_date) AS dates(needed_day)
                      WHERE needed_day BETWEEN :startDate AND :endDate.plusWeeks(1))
                """).query(DisplayGroceryItem.class).list();
        System.out.println("got grocery items");

        for (int i = 0; i < dbGroceriesResult.size(); i++) { // implement the rule stated above
            DisplayGroceryItem item = dbGroceriesResult.get(i);

            int displayQuantity = 0;  // sum quantity only for items within now - next 2 week
            ArrayList<Integer> displayNeedMeals = new ArrayList<>();
            if (item.needDate().length > 0) {
                LocalDate[] needDates = item.needDate();
                for (int j = 0; j < needDates.length; j++) {
                    LocalDate date = needDates[j];
                    if (date.isAfter(startDate) && date.isBefore(endDate.plusWeeks(1))) { // i think startDate and endDate will be now- 7days later? so for 2 weeks = endDate+7. for now, keeping startDate and EndDate structure so it can be variabl and modified
                        //within desired 2 week range. add quantity
                        displayQuantity += item.quantity()[j];
                        Integer mealID = item.needMealIDs()[j];
                        if (mealID != null) displayNeedMeals.add(mealID);
                    }
                }
            }
            dbGroceriesResult.set(i, new DisplayGroceryItem(item.id(), item.name(), item.quantity(), item.unit(), item.category(), item.needMealIDs(), item.note(), item.checked(), item.needDate(), displayQuantity, displayNeedMeals.toArray(new Integer[0])));
        }
        return dbGroceriesResult;
    }


}

