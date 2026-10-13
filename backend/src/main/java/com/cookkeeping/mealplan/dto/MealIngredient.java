package com.cookkeeping.mealplan.dto;

/** An ingredient and amount needed for a planned meal. */
public record MealIngredient(
        String name,
        Integer quantity,
        String unit
) {
}
