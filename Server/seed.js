const sequelize = require('./database');
const baseUrl = "https://www.dnd5eapi.co/api/";
const spellGetUrl = "https://www.dnd5eapi.co";
const axios = require('axios');


let seedQuery3 = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS descriptions CASCADE;
DROP TABLE IF EXISTS spells CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS schools_of_magic CASCADE;


CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(255) NOT NULL,
    class_hit_die VARCHAR(255) NOT NULL,
    class_proficiency_choices VARCHAR(255) NOT NULL,
    class_proficiencies VARCHAR(255) NOT NULL,
    saving_throws VARCHAR(255) NOT NULL,
    "starting_equipment_options" VARCHAR(255) NOT NULL
);

CREATE TABLE spells (
    spell_id SERIAL PRIMARY KEY,
    spell_name VARCHAR(1000),
    spell_info TEXT,
    spell_higher_level TEXT,
    spell_range VARCHAR(1000),
    spell_components VARCHAR(1000),
    spell_material VARCHAR(1000),
    spell_ritual BOOLEAN,
    spell_duration VARCHAR(1000),
    spell_concentration BOOLEAN,
    spell_casting_time VARCHAR(1000),
    spell_level VARCHAR(1000),
    spell_attack_type VARCHAR(1000),
    spell_damage_type VARCHAR(1000),
    school_of_magic VARCHAR(1000),
    classes VARCHAR(1000) 
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
    spell_info TEXT NOT NULL,
    spell_higher_level TEXT NOT NULL,
    spell_range VARCHAR(255) NOT NULL,
    spell_components VARCHAR(255),
    spell_material VARCHAR(255) NOT NULL,
    spell_ritual BOOLEAN NOT NULL,
    spell_duration VARCHAR(255) NOT NULL,
    spell_concentration BOOLEAN,
    spell_casting_time VARCHAR(255) NOT NULL,
    spell_level VARCHAR(255) NOT NULL,
    spell_attack_type VARCHAR(255) NOT NULL,
    spell_damage_type VARCHAR(255) NOT NULL,
    school_of_magic VARCHAR(255) NOT NULL,
    classes VARCHAR(255) NOT NULL
    
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
                //console.log(response.data)
                spellList = response.data.results;
            })
            .then(data => {
                console.log(spellList)
                res.status(200).json(spellList);
            })
            .catch(error => {
                res.status(500).send("Failed to send spells.")
            })
            .then(() => {
                sequelize.query(seedQuery2).then(() => {
                    console.log('DB has been seeded.')
                })
                .then(() => {
                    let values = spellList.map(spell => {
                        let nameEscaped = spell.name.replace(/'/g, "''");
                        return `('${spell.index}', '${nameEscaped}', ${spell.level}, '${spell.url}')`;
                    }).join(', ');
                    const sql = `INSERT INTO spells (spell_index, spell_name, spell_level, spell_url) VALUES ${values};`;
                    sequelize.query(sql).then(() => {
                        console.log('All spells inserted succesfully')
                    })
                .catch((error) => {
                    console.error('Error executing INSERT statement:', error)
                });
                }); 
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
    },
    // seed2: (req,res) => {
    
    //     axios.get(`${baseUrl}spells`)
    //         .then(response => {
    //             spellList = response.data.results.url;
    //             res.status(200).json(spellList)
    //         })
    //         .catch(error => {
    //             res.status(500).send("Failed to send spells.")
    //         })
    //         .then(() => {
    //             sequelize.query(seedQuery3).then(() => {
    //                 console.log('DB has been created.')
    //             })
    //             .then(() => {
    //                 sequelize.query(sql).then(() => {
    //                     console.log('All spells inserted succesfully')
    //                 })
    //             .catch((error) => {
    //                 console.error('Error executing INSERT statement:', error)
    //             });
    //             }); 
    //         })
    // },
    fetchAndProcessSpells: async (req, res) => {
        try {
            // First, get the list of spells
            const response = await axios.get(`${baseUrl}spells`);
            const spells = response.data.results;

            // Then fetch details for each spell concurrently
            const fetchSpellDetailsPromises = spells.map(spell => 
                axios.get(`${spellGetUrl}${spell.url}`)
            );

            // Wait for all the detailed requests to complete
            const results = await Promise.all(fetchSpellDetailsPromises);

            // Process results, e.g., log them or prepare for database insertion
            const detailedSpells = results.map(result => result.data);

            // Example of processing data further or sending it as a response
            console.log(detailedSpells); // Output the detailed data to the console
            res.status(200).json(detailedSpells); // Send detailed spells in response
        } catch (error) {
            console.error('Failed to fetch spells:', error);
            res.status(500).send('Failed to fetch spell details.');
        }
    },
    fetchAndInsertSpells: (req, res) => {
        sequelize.query(seedQuery3) // Resets tables
            .then(() => axios.get("https://www.dnd5eapi.co/api/spells")) // Fetch list of spells
            .then(response => {
                const spells = response.data.results;
                return Promise.all(spells.map(spell => axios.get(`https://www.dnd5eapi.co${spell.url}`)));
            })
            .then(detailsResponses => {
                const inserts = detailsResponses.map(detail => {
                    const spell = detail.data;
                    const values = [
                        spell.name.replace(/'/g, "''"), // Escaping single quotes
                        spell.desc.join(' ').replace(/'/g, "''"),
                        spell.higher_level ? spell.higher_level.join(' ').replace(/'/g, "''") : 'N/A',
                        spell.range.replace(/'/g, "''"),
                        spell.components ? spell.components.join(', ').replace(/'/g, "''") : 'V, S, M',
                        spell.material ? spell.material.replace(/'/g, "''") : 'None specified',
                        spell.ritual,
                        spell.duration.replace(/'/g, "''"),
                        spell.concentration,
                        spell.casting_time.replace(/'/g, "''"),
                        spell.level.toString(),
                        spell.attack_type ? spell.attack_type.replace(/'/g, "''") : 'None',
                        spell.damage?.damage_type?.name ? spell.damage.damage_type.name.replace(/'/g, "''") : 'None',
                        spell.school?.name.replace(/'/g, "''"),
                        spell.classes.map(cls => cls.name).join(', ').replace(/'/g, "''")
                    ];
                    return sequelize.query(
                        `INSERT INTO spells (
                            spell_name, spell_info, spell_higher_level, spell_range,
                            spell_components, spell_material, spell_ritual, spell_duration,
                            spell_concentration, spell_casting_time, spell_level, spell_attack_type,
                            spell_damage_type, school_of_magic, classes
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        {
                            replacements: values,
                            type: sequelize.QueryTypes.INSERT
                        }
                    ).catch(err => console.error('Insert error:', err));
                });
                return Promise.all(inserts);
            })
            .then(() => res.status(200).json({ message: "Spells inserted successfully" }))
            .catch(error => {
                console.error("Error in fetching or processing spells:", error);
                res.status(500).json({ error: "Failed to fetch or process spells", details: error.message });
            });

    }

}    

