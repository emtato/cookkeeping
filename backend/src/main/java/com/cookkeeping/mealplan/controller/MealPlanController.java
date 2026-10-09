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

    @PostMapping("/api/meal-plan/add")
    public void addRecipeToMealPlan(@RequestBody AddRecipeToMealPlanRequest request) {
        mealPlanService.addRecipeToMealPlan(request);
    }
}
