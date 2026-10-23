CREATE TABLE grocery_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER[] NOT NULL DEFAULT '{}'::INTEGER[],
    unit TEXT,
    "needMealIDs" INTEGER[] NOT NULL DEFAULT '{}'::INTEGER[],
    category TEXT NOT NULL,
    note TEXT,
    checked BOOLEAN NOT NULL DEFAULT FALSE,
    need_date DATE[] NOT NULL DEFAULT '{}'::DATE[],
    CONSTRAINT matching_need_lengths CHECK (
        cardinality(quantity) = cardinality(need_date)
        AND cardinality("needMealIDs") = cardinality(need_date)
    )
);
