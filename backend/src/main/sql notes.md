# SQL notes

SQL is the language; PostgreSQL is the database software / server, psql is the client where type sql.

## Run PostgreSQL

### Start the server

```sh
LC_ALL="en_US.UTF-8" /opt/homebrew/opt/postgresql@17/bin/postgres -D /opt/homebrew/var/postgresql@17
```

### Connect to the database/server (from root)

```sh
/opt/homebrew/opt/postgresql@17/bin/psql -d postgres
```

## Basics

PostgreSQL is the software that stores and manages a database. SQL is the language you use to ask that database questions and change its data.

| id | name | checked |
|---:|---|---|
| 1 | Milk | false |
| 2 | Rice | true |

Related data is organized into tables. Each row represents one grocery item. Each column represents one kind of information about every item.

## Navigation in psql

These commands do not need a semicolon:

| Command | Use |
|---|---|
| `\l` | List databases |
| `\c` | Switch databases |
| `\dt` | Show tables inside the current database |
| `\conninfo` | Show which database/server/user you are connected to |
| `\d grocery_items` | Show the table's columns and structure |
| `\q` | Exit |

## SQL

### Create and switch to a database

```sql
CREATE DATABASE cookkeeping;
```

Then use the psql command `\c cookkeeping` to enter it before using the SQL commands below.

### Add data

```sql
CREATE TABLE items (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    checked boolean NOT NULL DEFAULT false
);
```

```sql
INSERT INTO items (name) -- only provide name since id is generated here, checked has default
VALUES ('Milk'); -- following rows of what to insert

INSERT INTO items (name, checked)
VALUES
    ('Bread', false),
    ('Eggs', true);
```

The column list and value list match by position: 'Rice' goes into `name`, and `true` goes into `checked`. Text values use single quotes; `true` is a Boolean value, so it has no quotes.

To see new rows immediately, add `RETURNING *` before the final semicolon.

### Select data

```sql
SELECT name, checked -- choose which columns to display
FROM items -- look in this table
WHERE checked = false; -- keep only rows whose checked value is false

SELECT * FROM items; -- select every column inside items

TABLE practice_items; -- quicker PostgreSQL command to view all information in a table
```

### Update and delete data

```sql
UPDATE items
SET checked = true, name = 'milky'
WHERE id = 1
RETURNING *;

DELETE FROM items
WHERE id = 2
RETURNING *; -- shows the row that was deleted
```

### Undo changes

```sql
BEGIN;

UPDATE practice_items
SET checked = true
WHERE id = 1;

TABLE practice_items; -- inspect the change
```

Then choose one:

```sql
COMMIT; -- save changes
```

```sql
ROLLBACK; -- undo everything since BEGIN
```

## Keywords

| Keyword or clause | What it does | Example |
|---|---|---|
| `AND` | Both conditions must be true | `SELECT * FROM items WHERE checked = false AND name = 'Milk';` |
| `OR` | At least one condition must be true | `SELECT * FROM items WHERE name = 'Milk' OR name = 'Bread';` |
| `NOT` | Reverses a condition | `SELECT * FROM items WHERE NOT checked;` |
| `ORDER BY` | Sort the result | `SELECT * FROM items ORDER BY name ASC;` |
| `LIMIT` | Return at most a specified number of rows | `SELECT * FROM items LIMIT 5;` |
| `IS NULL` | Find missing values; `= NULL` does not work | `SELECT * FROM recipes WHERE description IS NULL;` |
| `JOIN ... ON` | Connect rows from different tables | `SELECT recipes.name, ingredients.name FROM recipes JOIN ingredients ON ingredients.recipe_id = recipes.id;`<br>Pair an ingredient with a recipe when that ingredient belongs to that recipe. `ON` determines which rows belong together. |
| `GROUP BY` | Put rows into groups so you can calculate totals or counts | `SELECT checked, COUNT(*) FROM items GROUP BY checked;` |

### `JOIN ... ON` rules

**`JOIN` combines two tables; it is kind of like “and” in English.**

`FROM recipes JOIN ingredients` tells the query to use both tables. But `JOIN` means “pair rows from these tables,” not the Boolean `AND`. The query still needs a rule for which rows pair up.

**`SELECT` chooses columns from the combined result.**

After the join has produced matching row pairs, `SELECT` chooses the columns to display. We write `recipes.name` and `ingredients.name` because both tables have a column called `name`; the table names say which one we mean.
