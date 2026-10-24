package com.cookkeeping.mealplan.controller;

import com.cookkeeping.mealplan.dto.AddRecipeToMealPlanRequest;
import com.cookkeeping.mealplan.service.MealPlanService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MealPlanController {

    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    // When this is implemented, the frontend calls this once when a meal is added. For each
    // ingredient, the service checks whether a matching grocery item is already in the DB.
    // If it is, the DB result gives us its ID so we can add this meal's need to that item;
    // otherwise we create it. The frontend doesn't need grocery IDs or to choose add/update.
    @PostMapping("/api/meal-plan/add")
    public void addRecipeToMealPlan(@RequestBody AddRecipeToMealPlanRequest request) {
        mealPlanService.addRecipeToMealPlan(request);
    }
}
