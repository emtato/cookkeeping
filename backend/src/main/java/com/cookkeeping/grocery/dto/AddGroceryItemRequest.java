package com.cookkeeping.grocery.dto;

import java.time.LocalDate;

/**
 * Created by Emilia on 2026-10-02!
 * Description: A new grocery item added by the user.
 * ^ • ω • ^
 */

// add and update are currently assumed to be user added, so a new need has no meal ID:
// its needMealIDs entry is null when inserted into the DB, but the array still lines up with quantity.
// needDate is optional when the user adds an item. If they give a date, the homescreen can show
// that the item is more urgent as the date gets closer.
public record AddGroceryItemRequest(
        String name,
        Integer[] quantity,
        String unit,
        String category,
        String note,
        boolean checked,
        LocalDate[] needDate) {
}
