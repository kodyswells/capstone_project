const express = require("express")
const cors = require("cors")

const app = express()  


app.use(express.json())
app.use(cors())

app.listen(7000, () => console.log("up on port 7000"));