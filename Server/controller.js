const axios = require('axios');
const sequelize = require('./database');

module.exports = {
    fetchSpells: (req, res) => {
        sequelize.query(`
            SELECT spells.*, (favorites.spell_id IS NOT NULL) AS is_favorite
            FROM spells
            LEFT JOIN favorites ON spells.spell_id = favorites.spell_id
        `, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(spells => {
            res.status(200).json(spells);
        })
        .catch(err => {
            console.error("Error fetching spells with favorite status:", err);
            res.status(500).send('Error fetching spells');
        });
    },
    fetchClasses: (req, res) => {
        sequelize.query(`
        SELECT * FROM classes
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            console.log(err)
        })
    },
    classIndex: (req, res) => {
        const classIndex = req.params.classIndex;
        // Using replacements in options for parameter binding
        sequelize.query('SELECT * FROM classes WHERE class_index = :classIndex', {
            replacements: { classIndex: classIndex },
            type: sequelize.QueryTypes.SELECT  // Specifies that this is a SELECT query
        })
        .then(result => {
            if (result.length > 0) {
                res.json(result[0]);  // Access the first result
            } else {
                res.status(404).send('Class not found');
            }
        })
        .catch(err => {
            console.error("Query error:", err);
            res.status(500).send('Error fetching class details');
        });
    },
    
    detailedSpell : (req,res) => {
        const spellIndex = req.params.spellIndex;
        sequelize.query(`SELECT * FROM spells WHERE spell_index = :spell_index`, {
            replacements: {spell_index: spellIndex},
            type: sequelize.QueryTypes.SELECT
        })
        .then(result => {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).send('Spell not found');
            }
        })
        .catch(err => {
            console.error("Query error:", err);
            res.status(500).send('Error fetching spell details');
        });
    },

    postFavorite: (req, res) => {
        const { spell_id } = req.body;
        // Make sure to use the correct parameter passing method with Sequelize
        sequelize.query('INSERT INTO favorites(spell_id) VALUES (:spell_id) RETURNING *', {
            replacements: { spell_id },
            type: sequelize.QueryTypes.INSERT
        })
        .then(result => res.status(201).json(result[0]))
        .catch(e => res.status(400).json({ error: e.message }));
    },

    deleteFavorite: (req, res) => {
        console.log(req.params);
        const spellId = req.params.spellId;
        if (!spellId) {
            return res.status(400).send('Invalid spell ID provided');
        }
    
        const query = `DELETE FROM favorites WHERE spell_id = ${spellId} RETURNING *`;
    
        sequelize.query(query, {
            type: sequelize.QueryTypes.DELETE
        })
        .then(result => {
            console.log(result)
            console.log(result[0])
            if (result === result) {
                res.json({ message: "Favorite deleted", deletedFavorite: result[0][0] });
            } else {
                console.log(result)
                res.status(404).send('Favorite not found');
            }
        })
        .catch(e => {
            console.error("Error on delete:", e);
            res.status(500).json({ error: e.message });
        });
    },

    fetchFavorites: (req, res) => {
        sequelize.query(`
            SELECT spells.*, favorites.favorite_id 
            FROM spells 
            JOIN favorites ON spells.spell_id = favorites.spell_id
        `, { type: sequelize.QueryTypes.SELECT })
        .then(spells => {
            res.status(200).json(spells);
        })
        .catch(err => {
            console.error("Error fetching favorite spells:", err);
            res.status(500).send('Error fetching favorite spells');
        });
    }
}
