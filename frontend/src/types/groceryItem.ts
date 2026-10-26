export type GroceryItem = {
    id: number;
    name: string;
    quantity?: (number | null)[]; //manual quantity calculated by this array + see which needmealIDs arenull
    unit?: string | null;
    category: string;
    needMealIDs?: (number | null)[];
    note?: string | null;
    checked: boolean;
    needDate?: (string | null)[];
    displayQuantity?: number;
    displayNeedMeals?: number[];
    subtext?: string;
};
