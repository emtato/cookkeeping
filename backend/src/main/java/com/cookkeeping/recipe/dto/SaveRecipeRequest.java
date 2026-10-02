package com.cookkeeping.recipe.dto;

import java.util.List;

/** The recipe details sent by the frontend when saving a recipe. */
public record SaveRecipeRequest(
        String name,
        String description,
        Integer servings,
        List<SaveIngredientRequest> ingredients,
        List<String> steps,
        String imageUrl,
        String category
) {
}
