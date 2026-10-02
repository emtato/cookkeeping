package com.cookkeeping.recipe.dto;


/** An ingredient supplied when saving a recipe. */
public record SaveIngredientRequest(
        String name,
        Integer quantity,
        String unit,
        String category,
        String note
) {
}
