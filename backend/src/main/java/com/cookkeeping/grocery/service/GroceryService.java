package com.cookkeeping.grocery.service;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class GroceryService {

    public void addGroceryItem(AddGroceryItemRequest request) {
        // if database contains item, increment quantity

        // if not, add item to database

    }

    public void deleteGroceryItem(int id) {

    }

    public void getGroceryItems(LocalDate startDate, LocalDate endDate) {

    }

    public void updateGroceryItem(UpdateGroceryItemRequest item) {

    }
}
