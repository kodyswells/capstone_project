const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const axios = require('axios')
const sequelize = require('./database');

const app = express();

const {seed} = require('./seed');
const {fetchSpells, fetchClasses, classIndex, detailedSpell, postFavorite, deleteFavorite, fetchFavorites} = require('./controller');



app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.post("/api/seed", seed);
app.get("/api/fetchSpells", fetchSpells);
app.get("/api/fetchClasses", fetchClasses);
app.get("/api/classes/:classIndex", classIndex);
app.get("/api/spell/:spellIndex", detailedSpell);
app.post("/api/favorites", postFavorite);
app.delete("/api/favorites/:spellId", deleteFavorite);
app.get("/api/favorites", fetchFavorites);


app.listen(7000, () => console.log(`up on port 7000`));