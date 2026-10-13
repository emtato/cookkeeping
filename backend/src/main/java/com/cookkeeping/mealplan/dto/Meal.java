package com.cookkeeping.mealplan.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * Created by Emilia on 2026-10-13!
 * Description:
 * ^ • ω • ^
 */


public record Meal(
        Long id,
        Long recipeId,
        String name,
        LocalDate plannedDate,
        List<MealIngredient> ingredients
        //more to come, dummy shape for now just so grocery items can have this ovject
) {

}
