package com.cookkeeping.persistence;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.DisplayGroceryItem;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.SqlArrayValue;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
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

    //eventually rename these manual paths to indicate ManualAddGroceryItemRequest/manualAddGroceryItem?
    //also fix the stupid errors on this file
    public void addGroceryItem(AddGroceryItemRequest request) {
        if (request.quantity() == null || request.quantity().length != 1) {
            throw new IllegalArgumentException("A manual grocery add needs one quantity entry");
        }
        LocalDate date;
        if (request.needDate() == null || request.needDate().length == 0)date = null;
        else date = request.needDate()[0];
        LocalDate[] needDates = {date};
        Integer[] needMealIDs = {null};

        jdbcClient.sql("""
                        INSERT INTO grocery_items (name, quantity, unit, category, note, checked, need_date, "needMealIDs")
                        VALUES (:name, :quantity, :unit, :category, :note, :checked, :needDate, :needMealIDs)
                        """)// define what input to insert and values, where the variables :name etc are attached by the .param
                .param("name", request.name())
                .param("quantity", new SqlArrayValue("integer", (Object[]) request.quantity()))
                .param("unit", request.unit())
                .param("category", request.category())
                .param("note", request.note())
                .param("checked", request.checked())
                .param("needDate", new SqlArrayValue("date", (Object[]) needDates))
                .param("needMealIDs", new SqlArrayValue("integer", (Object[]) needMealIDs))
                .update();
    }

    public void updateGroceryItem(UpdateGroceryItemRequest request) {
        // A null manualQuantity means this update only changes the item details (name, category, checked)
        // Leave all three need arrays alone, whether or not a user-generated need exists.
        if (request.manualQuantity() == null) {
            jdbcClient.sql("""
                    UPDATE grocery_items
                    SET name = :name, category = :category, checked = :checked
                    WHERE id = :id
                    """)
                    .param("id", request.id())
                    .param("name", request.name())
                    .param("category", request.category())
                    .param("checked", request.checked())
                    .update();
            return;
        }

        // TODO: This assumes zero or one user-generated need (null meal ID) per grocery row. If there can be several, we need a way to choose or combine them instead of using the first
        //attempt to update existing entry (already exists) with needmealID = null
        int updated = jdbcClient.sql("""
                UPDATE grocery_items
                SET name = :name, category = :category, checked = :checked, quantity[array_position("needMealIDs", NULL::integer)] = :manualQuantity
                WHERE id = :id AND array_position("needMealIDs", NULL::integer) IS NOT NULL
                """)
                .param("id", request.id())
                .param("name", request.name())
                .param("category", request.category())
                .param("checked", request.checked())
                .param("manualQuantity", request.manualQuantity())
                .update();
        // if no entry with null needmealid found (every single thing that uses this ingredient was from meals, no quantity from user gen at all)
        if (updated == 0) {
            updated = jdbcClient.sql("""
                    UPDATE grocery_items
                    SET name = :name, category = :category, checked = :checked,
                        quantity = array_append(quantity, :manualQuantity),
                        need_date = array_append(need_date, NULL::date),
                        "needMealIDs" = array_append("needMealIDs", NULL::integer)
                    WHERE id = :id AND array_position("needMealIDs", NULL::integer) IS NULL
                    """)
                    .param("id", request.id())
                    .param("name", request.name())
                    .param("category", request.category())
                    .param("checked", request.checked())
                    .param("manualQuantity", request.manualQuantity())
                    .update();
        }
        // TODO: If updated is still 0, no grocery row had this ID (or it changed during the update). Report that instead of saying nun
    }

    public void deleteGroceryItem(int[] ids) {
        jdbcClient.sql("""
                DELETE FROM grocery_items
                WHERE id IN (:ids);""").param("ids", Arrays.stream(ids).boxed().toList()).update(); //convert int[] into iterable
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
        // for this search, a null needDate is the "key" for a user gen entry with no due date
        // quantity and needMealIDs still have an entry in the same spot so the arrays keep up with each other
        // user gen entries with no due date are meant to stay until checked off (cleanup TODO).
        // if they have a due date, they follow the date window and can disappear from this list.
        dbGroceriesResult = (ArrayList<DisplayGroceryItem>) jdbcClient.sql("""
                  SELECT grocery_items.*,
                         NULL::integer AS displayquantity,
                         NULL::integer[] AS displayneedmeals
                  FROM grocery_items
                  WHERE EXISTS (
                      SELECT 1
                      FROM unnest(need_date) AS dates(needed_day)/* unnest takes all elements in need_date column and makes them individual rows, gives temp table name "dates" and "needed_day" column name */
                      WHERE (needed_day IS NULL) /* PATH 1: user gen item, accept. right now this accepts all checked items. eventually those need to be auto deleted after some time */
                         OR needed_day BETWEEN :startDate AND :endDate) /* PATH 2: grocery items with due date */
                """).param("startDate", startDate).param("endDate", endDate).query(DisplayGroceryItem.class).list();
        System.out.println("got grocery items");

        for (int i = 0; i < dbGroceriesResult.size(); i++) { // implement the rule stated above
            DisplayGroceryItem item = dbGroceriesResult.get(i);

            int displayQuantity = 0;  // sum quantity only for items within now - next 2 week
            ArrayList<Integer> displayNeedMeals = new ArrayList<>();
            if (item.needDate().length > 0) {
                LocalDate[] needDates = item.needDate();
                for (int j = 0; j < needDates.length; j++) {
                    LocalDate date = needDates[j];
                    boolean inDateRange = date != null && date.isAfter(startDate.minusDays(1)) && date.isBefore(endDate.plusWeeks(1).plusDays(1)); // i think startDate and endDate will be now- 7days later? so for 2 weeks = endDate+7. for now, keeping startDate and EndDate structure so it can be variabl and modified. also sql is inclusive, java is exclusive so
                    if ((date == null && !item.checked()) || inDateRange) {
                        //within desired 2 week range. add quantity
                        if (item.quantity()[j] != null) displayQuantity += item.quantity()[j];
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

