// HTTP calls to backend

import {GroceryItem} from "@/types/groceryItem";

const backendUrl = process.env.EXPO_PUBLIC_API_URL;


export type AddGroceryItemRequest = {
    name: string;
    quantity: number | null;
    unit: string | null;
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

export async function getGroceries(): Promise<GroceryItem[]> {

    return []
}

export async function deleteGroceryItem(itemIDs: string[]): Promise<void> {

}

export async function updateGroceryItem(item: GroceryItem): Promise<void> {

}
