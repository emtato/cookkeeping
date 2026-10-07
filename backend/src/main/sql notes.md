SQL is the language; PostgreSQL is the database software / server, psql is the client where type sql

## run postgres server

LC_ALL="en_US.UTF-8" /opt/homebrew/opt/postgresql@17/bin/postgres -D /opt/homebrew/var/postgresql@17

## connect to db/server (from root)

/opt/homebrew/opt/postgresql@17/bin/psql -d postgres

## basics

PostgreSQL is the software that stores and manages a database. SQL is the language you use to ask that database
questions and change its data.

| id | name | checked |
|---:|------|---------|
|  1 | Milk | false   |
|  2 | Rice | true    |

related data into tables, each row represents one grocery item. Each column represents one kind of information about
every item.


# nav (psql) (no semicolon ending)

\l list

\c switch db

\dt shows tables inside cur db

\conninfo exactly what database/server/user connected

\d grocery_items shows columns and structure

\q exit

# sql

CREATE DATABASE cookkeeping; to create it

-> psql \c cookkeeping to enter it before using below sql commands inside 

## add data

CREATE TABLE items (
id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name text NOT NULL,
checked boolean NOT NULL DEFAULT false
);

INSERT INTO items (name)  # only provide name since id is generated here, checked has default
VALUES ('Milk');  # following rows of what to insert

INSERT INTO items (name, checked)
VALUES
    ('Bread', false),
    ('Eggs', true); 
### The column list and value list match by position: 'Rice' goes into name, and true goes into checked. Text values use single quotes; true is a Boolean value, so it has no quotes.
to see new rows immediately,  add RETURNING *; before the above ;


## select

SELECT name, checked # chose which col to display

FROM items # look in this table

WHERE checked = false; # filter: keep only rows whose checked value is false.


SELECT * FROM items;  # wildcard so it selects litrally every column inside table items

TABLE practice_items; # quicker command to view all info in table for postgre only

## update/delete data

UPDATE items

SET checked = true, name = 'milky'

WHERE id = 1

RETURNING *;

DELETE FROM items

WHERE id = 2

RETURNING *; #shows the row that was deleteed   

## undo:

BEGIN;

UPDATE practice_items
SET checked = true
WHERE id = 1;

TABLE practice_items;  -- inspect the change

COMMIT; -- save changes, or ↓ 

ROLLBACK;  -- undo everything since BEGIN

# keywords

| Keyword or clause | What it does                                               | Example                                                                                                                                                                                                                                                 |
|---|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AND` | Both conditions must be true                               | `SELECT * FROM items WHERE checked = false AND name = 'Milk';`                                                                                                                                                                                          |
| `OR` | At least one condition must be true                        | `SELECT * FROM items WHERE name = 'Milk' OR name = 'Bread';`                                                                                                                                                                                            |
| `NOT` | Reverses a condition                                       | `SELECT * FROM items WHERE NOT checked;`                                                                                                                                                                                                                |
| `ORDER BY` | Sort the result                                            | `SELECT * FROM items ORDER BY name ASC;`                                                                                                                                                                                                                |
| `LIMIT` | Return at most a specified number of rows                  | `SELECT * FROM items LIMIT 5;`                                                                                                                                                                                                                          |
| `IS NULL` | Find missing values; `= NULL` no work                      | `SELECT * FROM recipes WHERE description IS NULL;`                                                                                                                                                                                                      |
| `JOIN ... ON` | Connect rows from different tables                         | `SELECT recipes.name, ingredients.name FROM recipes JOIN ingredients ON ingredients.recipe_id = recipes.id;`<br/> pair an ingredient with a recipe (from respective tables) when that ing belongs to that recp. ON determines which rows belong together. 
| `GROUP BY` | Put rows into groups so you can calculate totals or counts | `SELECT checked, COUNT(*) FROM items GROUP BY checked;`                                                                                                                                                                                                 |

## join .. on rules

#### JOIN combines two tables; kinda acts as ‘and’ in English.
FROM recipes JOIN ingredients tells the query to use both tables. But JOIN means “pair rows from these tables,” not the Boolean AND. The query still needs a rule for which rows pair up.

#### SELECT chooses columns from the combined result:
After the join has produced matching row pairs, SELECT chooses the columns to display. We write recipes.name and ingredients.name because both tables have a column called name; the table names say which one we mean. 
