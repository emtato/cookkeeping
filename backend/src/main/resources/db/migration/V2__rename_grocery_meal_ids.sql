-- Safe to run after V1 on both existing and fresh databases.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'grocery_items'
          AND column_name = 'planned_meal_id'
    ) THEN
        ALTER TABLE grocery_items RENAME COLUMN planned_meal_id TO "needMealIDs";
    END IF;
END $$;
