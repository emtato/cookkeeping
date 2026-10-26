package com.cookkeeping.grocery.service;

import com.cookkeeping.grocery.dto.AddGroceryItemRequest;
import com.cookkeeping.grocery.dto.DisplayGroceryItem;
import com.cookkeeping.grocery.dto.UpdateGroceryItemRequest;
import com.cookkeeping.persistence.AppRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GroceryService {

    private final AppRepository appRepository;

    public GroceryService(AppRepository appRepository) {
        this.appRepository = appRepository;
    }

    //only called by frntend when clicking new grocery item button, clicking existing item -> update
    public void addGroceryItem(AddGroceryItemRequest request) {
        //safety checks in case frontend error checking fails and uh oh! happens
        if (request.quantity() == null || request.quantity().length == 0)
            throw new IllegalArgumentException("Quantity cannot be empty");
        if (request.quantity()[0] < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        if (request.name() == null || request.name().isEmpty())
            throw new IllegalArgumentException("name cannot be empty");
        System.out.println("adding entry");
        appRepository.addGroceryItem(request);
    }

    //update grocery item, called by frontend when clicking update button
    public void updateGroceryItem(UpdateGroceryItemRequest item) {
        if (item.manualQuantity() != null && item.manualQuantity() < 0)
            throw new IllegalArgumentException("Quantity cannot be negative");
        if (item.name() == null || item.name().isEmpty()) throw new IllegalArgumentException("name cannot be empty");
        appRepository.updateGroceryItem(item);
    }

    // activated when ingredient is overdue or manually deleted by checking off and delete
    public void deleteGroceryItem(int[] id) {
        // later error check if somehow theres a mismatch or sum? delete from ui but its not acc in backend or something edge case
        appRepository.deleteGroceryItem(id);
    }

    // auto fetch when visiting grocery page
    public List<DisplayGroceryItem> getGroceryItems(LocalDate startDate, LocalDate endDate) {
        return appRepository.getGroceryItems(startDate, endDate);
    }


}
