# Northcoders News API

If you wish to clone this project and run it locally, you will _not_ have access to the necessary environment variables.

To successfully connect the two databases locally, you will need to create the following two files:

- `.env.development`
- `.env.test`

Into each file, add `PGDATABASE=`, followed by the correct database name for that environment (see `/db/setup.sql` for the database names).

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
