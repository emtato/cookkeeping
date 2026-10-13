package com.cookkeeping.grocery.dto;
import java.time.LocalDate;
/**
 * Created by Emilia on 2026-10-12!
 * Description:
 * ^ • ω • ^
 */

// changes to an existing grocery item identified by its id
public record UpdateGroceryItemRequest(
        Integer id,
        String name,
        Integer quantity,
        String unit,
        String category,
        String note,
        boolean checked,
        LocalDate[] needDate) {
}
