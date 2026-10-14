CREATE TABLE grocery_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER,
    unit TEXT,
    category TEXT NOT NULL,
    note TEXT,
    checked BOOLEAN NOT NULL DEFAULT FALSE,
    need_date DATE[] NOT NULL DEFAULT '{}'::DATE[]
);
