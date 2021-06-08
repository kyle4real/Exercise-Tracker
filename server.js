const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const uniqid = require("uniqid");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

app.post("/api/users", (req, res) => {
    console.log(req.body.username);
    // res.json({ test: req.body.username });
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`App is listening on port ${listener.address().port}`);
});
