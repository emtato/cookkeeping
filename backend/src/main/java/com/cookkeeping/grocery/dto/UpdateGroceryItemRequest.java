package com.cookkeeping.grocery.dto;
/**
 * Created by Emilia on 2026-10-12!
 * Description:
 * ^ • ω • ^
 */

// a manual edit changes this amount, not the quantities needed by planned meals
public record UpdateGroceryItemRequest(
        Integer id,
        String name,
        // two fields in ui: planned meals amount is uneditable; this user-added amount is editable
        // null means the user did not change the amount
        Integer manualQuantity,
        boolean checked,
        String category) {
}
