package com.cookkeeping.mealplan.dto;

import java.time.LocalDate;

/** The recipe and date selected for a planned meal. */
public record AddRecipeToMealPlanRequest(
        Long recipeId,
        LocalDate plannedDate
) {
}
