const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const uniqid = require("uniqid");
const { addUser, getAllUsers, addExercise, getUserLogs } = require("./database");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
});

app.post("/api/users", async (req, res) => {
    const username = req.body.username;
    const uniqueId = uniqid();
    const exists = await addUser(username, uniqueId);
    if (exists) {
        res.send("Username already taken");
    } else {
        res.json({ username, _id: uniqueId });
    }
});

app.get("/api/users", async (req, res) => {
    const userArr = await getAllUsers();
    res.send(
        userArr.map((obj) => {
            return {
                _id: obj._id,
                username: obj.username,
            };
        })
    );
});

app.post("/api/users/:_id/exercises", async (req, res) => {
    const obj = req.body;
    if (!obj[":_id"]) return res.send("Path ':_id' is required");
    if (!obj.description) return res.send("Path 'description' is required");
    if (!obj.duration) return res.send("Path 'duration' is required");
    obj.duration = parseInt(obj.duration);
    if (!obj.duration) return res.send("Path 'duration' must be a Number");
    if (!obj.date) {
        obj.date = new Date().toDateString();
    } else {
        obj.date = new Date(obj.date).toDateString();
    }
    const _id = req.params._id;
    const username = await addExercise(_id, obj);
    if (!username) return res.send("User does not exist");
    res.json({
        username,
        _id,
        description: obj.description,
        duration: obj.duration,
        date: obj.date,
    });
});

app.get("/api/users/:_id/logs", async (req, res) => {
    const queries = Object.keys(req.query).length !== 0;
    const _id = req.params._id;
    const obj = await getUserLogs(_id);
    if (!obj) return res.send("User does not exist");
    const logs = obj.logs.map((obj) => {
        return {
            description: obj.description,
            duration: obj.duration,
            date: obj.date,
        };
    });

    const filteredLogs = !queries ? logs : handleQueries(logs, req.query);
    res.json({
        _id,
        username: obj.username,
        count: filteredLogs.length,
        log: filteredLogs,
    });
});

const handleQueries = (logs, query) => {
    const startDate = query.from ? new Date(query.from) : new Date(0);
    const endDate = query.to ? new Date(query.to) : new Date();
    const fLogs = logs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= startDate && logDate <= endDate;
    });
    if (!query.limit) return fLogs;
    const limitNum = query.limit >= fLogs.length || query.limit <= 0 ? fLogs.length : query.limit;
    return fLogs.slice(0, limitNum);
};

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`App is listening on port ${listener.address().port}`);
});
