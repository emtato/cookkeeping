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
        Integer manualQuantity,
        String category) {
}
