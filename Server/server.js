const express = require("express");
const cors = require("cors");
const axios = require('axios')
const sequelize = require('./database');
const seed = require('./seed');
const app = express();

const {fetchSpells} = require('./controller');

app.use(express.json());
app.use(cors());

app.post("/api/seed", seed);
app.get("/api/fetchSpells", fetchSpells);

app.listen(7000, () => console.log("up on port 7000"));