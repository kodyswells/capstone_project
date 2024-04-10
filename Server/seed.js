const sequelize = require('./database');

let seedQuery = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS descriptions CASCADE;
DROP TABLE IF EXISTS spells CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS schools_of_magic CASCADE;

CREATE TABLE schools_of_magic (
    school_of_magic_id SERIAL PRIMARY KEY,
    school_of_magic_name VARCHAR(255) NOT NULL
);

CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL
);

CREATE TABLE spells (
    spell_id SERIAL PRIMARY KEY,
    spell_name VARCHAR(255) NOT NULL,
    school_of_magic_id INT NOT NULL REFERENCES schools_of_magic(school_of_magic_id),
    class_id INT NOT NULL REFERENCES classes(class_id),
    spell_info text NOT NULL
);

CREATE TABLE descriptions (
    description_id SERIAL PRIMARY KEY,
    spell_info text,
    spell_id INT NOT NULL REFERENCES spells(spell_id)
);

CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    spell_id INT NOT NULL REFERENCES spells(spell_id)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    favorite_id INT REFERENCES favorites(favorite_id)
);`



const seed = () => {
    sequelize.query(seedQuery).then(() => {
            console.log('DB has been seeded.')
        });
}


module.exports = seed;