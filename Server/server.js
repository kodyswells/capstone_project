const express = require("express");
const cors = require("cors");
const axios = require('axios')
const sequelize = require('./database');

const app = express();

const {seed, seed2} = require('./seed');

app.use(express.json());
app.use(cors());

app.post("/api/seed", seed);




app.listen(7000, () => console.log("up on port 7000"));