export type Meal = {
    id: number,
    name: string,
    description: string,
    ingredients: string[]
    dateMeal: string,
    steps: string[],
    price?: number,
    image?: string,
    category?: string,
}
