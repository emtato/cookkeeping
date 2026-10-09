package com.cookkeeping.grocery.controller;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

import com.cookkeeping.grocery.service.GroceryService;

/**
 * Created by Emilia on 2026-10-02!
 * Description:
 * ^ • ω • ^
 */


@RestController
public class GroceryListController {

    private final GroceryService groceryService;

    public GroceryListController(GroceryService groceryService) {
        this.groceryService = groceryService;
    }

    @PostMapping("/api/groceries/add") //allow dispatcher to map to this
    public void addGroceryItem(@RequestBody AddGroceryItemRequest request) {
        System.out.println("add" + request.name());
        groceryService.addGroceryItem(request);
    }

    @PostMapping("/api/groceries/delete")
    public void deleteGroceryItem(int id) {
        System.out.println("delete" + id);
        groceryService.deleteGroceryItem(id);
    }

    @PostMapping("/api/groceries/get")
    public void getGroceryItems(LocalDate startDate, LocalDate endDate) {
        System.out.println("get" + startDate.toString() + " to " + endDate.toString());
        groceryService.getGroceryItems(startDate, endDate);
    }
}
