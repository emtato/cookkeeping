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

    @PostMapping("/api/groceries/add") //allow dispatcher to map to this. since
    public void addGroceryItem(@RequestBody AddGroceryItemRequest request) {
        System.out.println(request.name());


    }

}
