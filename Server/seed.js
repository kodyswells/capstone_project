const sequelize = require('./database');
const axios = require('axios');


let seedQuery = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS descriptions CASCADE;
DROP TABLE IF EXISTS spells CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS schools_of_magic CASCADE;


CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_index VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    hit_die INT NOT NULL,
    proficiency_choices TEXT,
    saving_throws TEXT,
    starting_equipment TEXT
);

CREATE TABLE spells (
    spell_id SERIAL PRIMARY KEY,
    spell_index VARCHAR(255),
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

module.exports = {
    seed: (req, res) => {
        sequelize.query(seedQuery) // Resets tables
            .then(() => axios.get("https://www.dnd5eapi.co/api/spells")) // Fetch list of spells
            .then(response => {
                const spells = response.data.results;
                return Promise.all(spells.map(spell => axios.get(`https://www.dnd5eapi.co${spell.url}`)));
            })
            .then(detailsResponses => {
                const inserts = detailsResponses.map(detail => {
                    const spell = detail.data;
                    const values = [
                        spell.name.replace(/'/g, "''"),
                        spell.index.replace(/'/g, "''"),
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
                            spell_name, spell_index, spell_info, spell_higher_level, spell_range,
                            spell_components, spell_material, spell_ritual, spell_duration,
                            spell_concentration, spell_casting_time, spell_level, spell_attack_type,
                            spell_damage_type, school_of_magic, classes
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        {
                            replacements: values,
                            type: sequelize.QueryTypes.INSERT
                        }
                    ).catch(err => console.error('Insert error:', err));
                });
                return Promise.all(inserts);
            })
            .then(() => axios.get('https://www.dnd5eapi.co/api/classes')) // Fetch list of classes
            .then(response => {
                const classes = response.data.results;
                return Promise.all(classes.map(cls => axios.get(`https://www.dnd5eapi.co${cls.url}`)));
            })
            .then(detailsResponses => {
                const inserts = detailsResponses.map(detail => {
                    const cls = detail.data;
                    const proficiencyChoices = cls.proficiency_choices.map(pc =>
                        `${pc.choose} from ${pc.from.options.map(o => o.item ? o.item.name : 'Unknown').join(', ')}`
                    ).join('; ');
                    const savingThrows = cls.saving_throws.map(st => st.name ? st.name : 'Unknown').join(', ');
                    const startingEquipment = cls.starting_equipment.map(se =>
                        se.equipment ? `${se.equipment.name} x ${se.quantity}` : 'Unknown equipment'
                    ).join(', ');

                    return sequelize.query(`
                        INSERT INTO classes (
                            class_index, class_name, hit_die, proficiency_choices,
                            saving_throws, starting_equipment
                        ) VALUES (?, ?, ?, ?, ?, ?);`,
                        {
                            replacements: [
                                cls.index,
                                cls.name,
                                cls.hit_die,
                                proficiencyChoices,
                                savingThrows,
                                startingEquipment
                            ],
                            type: sequelize.QueryTypes.INSERT
                        }
                    ).catch(err => console.error('Class insert error:', err));
                });
                return Promise.all(inserts);
            })
            .then(() => res.status(201).json({ message: "Database created, and Classes and Spells were imported successfully" }))
        .catch(error => {
            console.error("Error in fetching or processing data:", error);
            res.status(500).json({ error: "Failed to fetch or process data", details: error.message });
        });
    }
   
}