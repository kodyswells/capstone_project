const sequelize = require('./database');
const baseUrl = "https://www.dnd5eapi.co/api/";
const spellUrl = "https://www.dnd5eapi.co";
const axios = require('axios');

let spellList = [];


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

let seedQuery2 = `
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
    spell_index VARCHAR(255) NOT NULL,
    spell_name VARCHAR(255) NOT NULL,
    spell_level INT NOT NULL,
    spell_url VARCHAR(255) NOT NULL
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


module.exports = {

    fetchSpells: (req,res) => {
        axios.get(`${baseUrl}spells`)
            .then(response => {
                spellList = response.data;
            })
            .then(data => {
                console.log(spellList)
                res.status(200).json(spellList);
            })
            .catch(error => {
                res.status(500).send("Failed to send spells.")
            })
    },
    seed: () => {
        sequelize.query(seedQuery2).then(() => {
                console.log('DB has been seeded.')
            })
            .then(() => {
                let values = spellList.map(spell => `('${spell.index}', '${spell.name}', ${spell.level}, '${spell.url}')`).join(', ');
                const sql = `INSERT INTO spells (spell_index, spell_name, spell_level, spell_url) VALUES ${values};`;
                sequelize.query(sql).then(() => {
                    console.log('All spells inserted succesfully')
                })
            .catch((error) => {
                console.error('Error executing INSERT statement:', error)
            });
            });
    }
}

    

