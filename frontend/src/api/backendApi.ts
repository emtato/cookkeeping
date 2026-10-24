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


// TODO: user-added grocery needs should send matching quantity, needDate, and needMealIDs arrays.
// For a user-added need, put null in its needMealIDs position and in its needDate position
// if no date was entered. When manually updating an item, keep any existing meal IDs.
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
    quantity: number; //manual quantity added. quantities required by meals uneditable
    unit: string; //unit should be changeable, but important: if unit is changed, quantity should be updated to match, not done yet.
    category: string;
    note: string | null;
    checked: boolean;
};

//add more types when more flows are implemented

//should we return something useful like http status? probably (later)

export async function addGroceryItem(item: AddGroceryItemRequest): Promise<void> {
    const response = await fetch(`${backendUrl}/api/groceries/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item),
    });
}

export async function updateGroceryItem(item: GroceryItem): Promise<void> {
    const response = await fetch(`${backendUrl}/api/groceries/update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item),
    })
}

export async function deleteGroceryItem(itemIDs: string[]): Promise<void> {
    const response = await fetch(`${backendUrl}/api/groceries/delete`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(itemIDs),
    });

}

//should be called upon first open grocery / every save/update
export async function getGroceries(): Promise<GroceryItem[]> {
    const response = await fetch(`${backendUrl}/api/groceries/get`);
    return await response.json();
}
