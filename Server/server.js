const express = require("express");
const cors = require("cors");
//const sequelize = require('./database');
const seed = require('./seed');
const app = express();


app.use(express.json())
app.use(cors())

app.post("/api/seed", seed)

app.listen(7000, () => console.log("up on port 7000"));