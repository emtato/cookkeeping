package com.cookkeeping.grocery.dto;
/**
 * Created by Emilia on 2026-10-02!
 * Description:
 * ^ • ω • ^
 */


/**
 * A grocery item added to list by user
 */
public record AddGroceryItemRequest(
        String name,
        Integer quantity,
        String unit,
        String category,
        String note,
        boolean checked) {
}

