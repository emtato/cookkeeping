package com.cookkeeping.grocery.service;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import com.cookkeeping.persistence.AppRepository;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.time.LocalDate;

@Service
public class GroceryService {

    private final AppRepository appRepository;

    public GroceryService(AppRepository appRepository) {
        this.appRepository = appRepository;
    }

    public void addGroceryItem(AddGroceryItemRequest request) {
        // if database contains item, increment quantity
        if (false) { //TODO
            System.out.println("updating entry");

        }
        else {
            // if not, add item to database
            System.out.println("adding entry");
            appRepository.addGroceryItem(request);
        }
    }

    public void deleteGroceryItem(int id) {

    }

    public void getGroceryItems(LocalDate startDate, LocalDate endDate) {

    }

    public void updateGroceryItem(UpdateGroceryItemRequest item) {

    }
}
