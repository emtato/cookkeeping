// HTTP calls to backend

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

export async function addGroceryItem(item: AddGroceryItemRequest): Promise<void> {
    const response = await fetch(`${backendUrl}/api/groceries/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item),
    });
    // TODO: Build the full URL to POST /api/groceries/add on the running backend.
    // TODO: Call fetch with method POST and a JSON body made from _item.
    // TODO: Check the HTTP response before reporting success to the screen.
}
