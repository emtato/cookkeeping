package com.cookkeeping.grocery.dto;

import java.time.LocalDate;

/**
 * Created by Emilia on 2026-10-21!
 * Description:
 * ^ • ω • ^
 */


// returned grocery items  from db
public record GroceryItem(
        Integer id,
        String name,
        Integer quantity,
        String unit,
        String category,
        String note,
        boolean checked,
        LocalDate[] needDate) {
}
