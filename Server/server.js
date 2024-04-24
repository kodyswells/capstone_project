const express = require("express");
const cors = require("cors");
const axios = require('axios')
const sequelize = require('./database');

const app = express();

const {seed} = require('./seed');
const {fetchSpells, fetchClasses, classIndex, detailedSpell} = require('./controller');



app.use(express.json());
app.use(cors());


app.post("/api/seed", seed);
app.get("/api/fetchSpells", fetchSpells);
app.get("/api/fetchClasses", fetchClasses);
app.get("/api/classes/:classIndex", classIndex);
app.get("/api/spell/:spellIndex", detailedSpell);



app.listen(7000, () => console.log(`up on port 7000`));