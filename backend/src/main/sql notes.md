SQL is the language; PostgreSQL is the database software / server, psql is the client where type sql

run postgres server
LC_ALL="en_US.UTF-8" /opt/homebrew/opt/postgresql@17/bin/postgres -D /opt/homebrew/var/postgresql@17

connect to db/server (from root) /opt/homebrew/opt/postgresql@17/bin/psql -d postgres

CREATE DATABASE cookkeeping; to create it

\c cookkeeping //psql command no semicolon,switch to our db from default

define the grocery_items table. A table is where PostgreSQL will store each item as a row; the Java request record doesn’t create it automatically.
