// HTTP calls to backend

import {GroceryItem} from "@/types/groceryItem";

const backendUrl = process.env.EXPO_PUBLIC_API_URL;

export type MealIngredient = {
    name: string;
    quantity: number | null;
    unit: string | null;
};

export type Meal = {
    id: number;
    recipeId: number;
    name: string;
    plannedDate: string;
    ingredients: MealIngredient[];
};


// A date the user does provide can be used to show urgency on the homescreen as it gets closer.
export type AddGroceryItemRequest = {
    name: string;
    quantity: number[];
    unit: string;
    category: string;
    note: string | null;
    checked: boolean;
    needDate: string[];
};

export type UpdateGroceryItemRequest = {
    id: number;
    name: string;
    manualQuantity: number | null; //null leaves the current quantity unchanged
    unit: string | null; //unit should be changeable, but important: if unit is changed, quantity should be updated to match, not done yet.
    category: string;
    note: string | null;
    checked: boolean;
};

//add more types when more flows are implemented

export async function addGroceryItem(item: AddGroceryItemRequest): Promise<void> {
    const response = await fetch(`${backendUrl}/api/groceries/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item),
    });
    // TODO: Read the HTTP response and handle unsuccessful status codes.
}

export async function updateGroceryItem(item: UpdateGroceryItemRequest): Promise<void> {
    const response = await fetch(`${backendUrl}/api/groceries/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item),
    })
    // TODO: Read the HTTP response and handle unsuccessful status codes.
}

export async function deleteGroceryItem(itemIDs: number[]): Promise<void> {
    const response = await fetch(`${backendUrl}/api/groceries/delete`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(itemIDs),
    });
    // TODO: Read the HTTP response and handle unsuccessful status codes.
}

//should be called upon first open grocery / every save/update
export async function getGroceries(): Promise<GroceryItem[]> {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const startDate = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
    const endDate = nextWeek.getFullYear() + "-" + String(nextWeek.getMonth() + 1).padStart(2, '0') + "-" + String(nextWeek.getDate()).padStart(2, '0');

    const response = await fetch(`${backendUrl}/api/groceries/get?startDate=${startDate}&endDate=${endDate}`, {
        method: 'POST',
    });

    // TODO: Check the HTTP response before parsing its JSON body.
    return await response.json();
}
