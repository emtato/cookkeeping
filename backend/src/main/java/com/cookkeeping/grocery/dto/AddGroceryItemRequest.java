package com.cookkeeping.grocery.dto;
import com.cookkeeping.mealplan.dto.Meal;
import java.time.LocalDate;
import java.util.List;

/**
 * Created by Emilia on 2026-10-02!
 * Description:
 * ^ • ω • ^
 */

/** A new grocery item added to a date range by the user */
public record AddGroceryItemRequest(
        String name,
        Integer quantity,
        String unit,
        String category,
        String note,
        boolean checked,
        LocalDate [] needDate,
        List<Meal> needMeals) {
}
