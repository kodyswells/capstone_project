const axios = require('axios');
const sequelize = require('./database');

module.exports = {
    fetchSpells: (req,res) => {
        sequelize.query(`
        SELECT * FROM spells 
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err =>
            console.log(err))
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
    }
}





