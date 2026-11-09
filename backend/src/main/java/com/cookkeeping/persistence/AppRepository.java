package com.cookkeeping.persistence;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.DisplayGroceryItem;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.SqlArrayValue;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


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
        if (request.needDate() == null || request.needDate().length == 0) date = null;
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
        // A null manualQuantity means this update only changes the item details
        // Leave all three need arrays alone, whether or not a user-generated need exists.
        if (request.manualQuantity() == null) {
            jdbcClient.sql("""
                            UPDATE grocery_items
                            SET name = :name, unit = :unit, category = :category, note = :note, checked = :checked
                            WHERE id = :id
                            """)
                    .param("id", request.id())
                    .param("name", request.name())
                    .param("unit", request.unit())
                    .param("category", request.category())
                    .param("note", request.note())
                    .param("checked", request.checked())
                    .update();
            return;
        }

        // TODO: This assumes zero or one user-generated need (null meal ID) per grocery row. If there can be several, we need a way to choose or combine them instead of using the first
        //attempt to update existing entry (already exists) with needmealID = null
        int updated = jdbcClient.sql("""
                        UPDATE grocery_items
                        SET name = :name, unit = :unit, category = :category, note = :note, checked = :checked,
                            quantity[array_position("needMealIDs", NULL::integer)] = :manualQuantity
                        WHERE id = :id AND array_position("needMealIDs", NULL::integer) IS NOT NULL
                        """)
                .param("id", request.id())
                .param("name", request.name())
                .param("unit", request.unit())
                .param("category", request.category())
                .param("note", request.note())
                .param("checked", request.checked())
                .param("manualQuantity", request.manualQuantity())
                .update();
        // if no entry with null needmealid found (every single thing that uses this ingredient was from meals, no quantity from user gen at all)
        if (updated == 0) {
            updated = jdbcClient.sql("""
                            UPDATE grocery_items
                            SET name = :name, unit = :unit, category = :category, note = :note, checked = :checked,
                                quantity = array_append(quantity, :manualQuantity),
                                need_date = array_append(need_date, NULL::date),
                                "needMealIDs" = array_append("needMealIDs", NULL::integer)
                            WHERE id = :id AND array_position("needMealIDs", NULL::integer) IS NULL
                            """)
                    .param("id", request.id())
                    .param("name", request.name())
                    .param("unit", request.unit())
                    .param("category", request.category())
                    .param("note", request.note())
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

        List<Map<String, Object>> dbGroceriesResult;
        /*
        unnest(need_date) turns the array into individual date rows
        EXISTS is true if at least one of those rows passes the test.
        */
        // for this search, a null needDate is the "key" for a user gen entry with no due date
        // quantity and needMealIDs still have an entry in the same spot so the arrays keep up with each other
        // user gen entries with no due date are meant to stay until checked off (cleanup TODO).
        // if they have a due date, they follow the date window and can disappear from this list.

        //take raw returned db result, then manually convert into DisplayGroceryItem later to ensure types are converted properly
        dbGroceriesResult = jdbcClient.sql("""
                              SELECT grocery_items.*,
                               NULL::integer AS displayquantity,
                               NULL::integer[] AS displayneedmeals
                        FROM grocery_items
                        WHERE EXISTS (
                            SELECT 1
                            FROM unnest(need_date) AS dates(needed_day)/* unnest takes all elements in need_date column and makes them individual rows, gives temp table name "dates" and "needed_day" column name */
                            WHERE (needed_day IS NULL) /* PATH 1: user gen item, accept. right now this accepts all checked items. eventually those need to be auto deleted after some time */
                               OR needed_day BETWEEN :startDate AND :endDate) /* PATH 2: grocery items with due date */
                               ORDER BY grocery_items.id /*order by id so it isnt changed when selecting and stuff*/
                        """)
                .param("startDate", startDate).param("endDate", endDate)
                .query().listOfRows();
        //each Map represents one row
        ArrayList<DisplayGroceryItem> convertedGroceries = new ArrayList<>();
        try {
            for (int i = 0; i < dbGroceriesResult.size(); i++) {
                Map<String, Object> m = dbGroceriesResult.get(i);
                java.sql.Array quantityPgArray = (java.sql.Array) m.get("quantity");
                Integer[] quantity = (Integer[]) quantityPgArray.getArray();

                java.sql.Array needMealIDPg = (java.sql.Array) m.get("needMealIDs");
                Integer[] needMealIds = (Integer[]) needMealIDPg.getArray();

                java.sql.Array needDatesPg = (java.sql.Array) m.get("need_date");
                Date[] needDatesIntermediary = (Date[]) needDatesPg.getArray();
                LocalDate[] needDates = new LocalDate[needDatesIntermediary.length];
                for (int j = 0; j < needDatesIntermediary.length; j++) {
                    if (needDatesIntermediary[j] == null) needDates[j] = null;
                    else needDates[j] = needDatesIntermediary[j].toLocalDate();
                }

                // implement the rule stated above
                int displayQuantity = 0;  // sum quantity only for items within now - next 2 week
                ArrayList<Integer> displayNeedMeals = new ArrayList<>();

                if (needDates.length > 0) { //sum up values from each need date if within range
                    for (int j = 0; j < needDates.length; j++) {
                        LocalDate date = needDates[j];
                        boolean inDateRange = (date != null && date.isAfter(startDate.minusDays(1)) && date.isBefore(endDate.plusWeeks(1).plusDays(1))); // i think startDate and endDate will be now- 7days later? so for 2 weeks = endDate+7. for now, keeping startDate and EndDate structure so it can be variabl and modified. also sql is inclusive, java is exclusive so
                        if ((date == null && !(boolean) m.get("checked")) || inDateRange) {
                            //within desired 2 week range. add quantity
                            if (quantity[j] != null) displayQuantity += quantity[j];
                            Integer mealID = needMealIds[j];
                            if (mealID != null) displayNeedMeals.add(mealID);
                        }
                    }
                }

                convertedGroceries.add(new DisplayGroceryItem((int) m.get("id"), m.get("name").toString(), quantity, (String) m.get("unit"),
                        needMealIds, m.get("category").toString(), (String) m.get("note"), (boolean) m.get("checked"), needDates, displayQuantity, displayNeedMeals.toArray(Integer[]::new)));
            }
        }
        catch (SQLException e) {
            throw new DataRetrievalFailureException("Could not read grocery item arrays", e);
        }

        System.out.println("got grocery items");

        return convertedGroceries;
    }
}


