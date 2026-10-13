package com.cookkeeping.grocery.dto;
import java.time.LocalDate;

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
        LocalDate [] needDate) {
}
