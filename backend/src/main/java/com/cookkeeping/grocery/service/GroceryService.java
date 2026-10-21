package com.cookkeeping.grocery.service;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.GroceryItem;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import com.cookkeeping.persistence.AppRepository;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.time.LocalDate;
import java.util.List;

@Service
public class GroceryService {

    private final AppRepository appRepository;

    public GroceryService(AppRepository appRepository) {
        this.appRepository = appRepository;
    }

    public void addGroceryItem(AddGroceryItemRequest request) {
        // if not, add item to database
        System.out.println("adding entry");
        appRepository.addGroceryItem(request);
    }

    public void updateGroceryItem(UpdateGroceryItemRequest item) {
        appRepository.updateGroceryItem(item);
    }

    public void deleteGroceryItem(int id) {
        // later error check if somehow theres a mismatch or sum? delete from ui but its not acc in backend or something edge case
        appRepository.deleteGroceryItem(id);
    }

    public List<GroceryItem> getGroceryItems(LocalDate startDate, LocalDate endDate) {
        return appRepository.getGroceryItems(LocalDate startDate, LocalDate endDate);
    }


}
