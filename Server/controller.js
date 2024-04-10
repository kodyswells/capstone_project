const axios = require('axios');
const sequelize = require('./database');

let spellList = [];
const baseUrl = "https://www.dnd5eapi.co/api/";

module.exports = {

    fetchSpells: (req,res) => {
        axios.get(`${baseUrl}spells`)
            .then(response => {
                console.log("response", response.data)
                spellList = response.data;
                
                res.status(200).json(spellList);
            })
            .catch(error => {
                res.status(500).send("Failed to send spells.")
            })
    }
    
}