package com.cookkeeping.recipe.dto;

import java.math.BigDecimal;

/** An ingredient supplied when saving a recipe. */
public record SaveIngredientRequest(
        String name,
        BigDecimal quantity,
        String unit,
        String category,
        String note
) {
}
