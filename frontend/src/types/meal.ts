export type Meal = {
    id: number,
    name: string,
    description: string,
    ingredients: string[]
    steps: string[],
    price?: number,
    image?: string,
    category?: string,
}
