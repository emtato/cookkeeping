package com.cookkeeping.controllers;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.io.*;

/**
 * Created by Emilia on 2026-10-02!
 * Description:
 * ^ • ω • ^
 */


@RestController
public class GroceryListController {

    @PostMapping("/api/groceries/add") //allow dispatcher to map to this
    public void addGroceryItem(@RequestBody AddGroceryItemRequest request) {
        System.out.println("add" + request.name());
    }

    @PostMapping("/api/groceries/delete")
    public void deleteGroceryItem(@RequestBody AddGroceryItemRequest request) {
        System.out.println("delete" + request.name());
    }

}
