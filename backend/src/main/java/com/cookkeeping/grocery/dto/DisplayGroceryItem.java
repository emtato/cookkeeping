package com.cookkeeping.grocery.dto;

import java.time.LocalDate;

/**
 * Created by Emilia on 2026-10-21!
 * Description:
 * ^ • ω • ^
 */


// returned grocery items  from db
public record DisplayGroceryItem(
        Integer id,
        String name,
        Integer[] quantity,
        String unit,
        String category,
        Integer[] needMealIDs,
        String note,
        boolean checked,
        LocalDate[] needDate,
        // This total includes planned meal quantities. The user can change the manual amount,
        // but cannot decrease the total below what the planned meals need. To change those
        // quantities, they need to change the ingredients in the planned meals instead.
        Integer displayQuantity,
        Integer[] displayNeedMeals) {
}
