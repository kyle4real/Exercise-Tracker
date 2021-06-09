// const mongo = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to database.");
});

// SCHEMAS //
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    _id: String,
    logs: [
        {
            date: String,
            duration: Number,
            description: String,
        },
    ],
});

// MODELS //
const User = mongoose.model("User", userSchema);

// FUNCTIONS //
const addUser = async (username, uniqueId) => {
    // check if it already exists
    if (await User.findOne({ username }).exec()) return 1;
    // add it if it does not exist
    User.create({ username, _id: uniqueId, logs: [] });
    return 0;
};

const getAllUsers = async () => {
    return User.find({});
};

const addExercise = async (_id, obj) => {
    const userObj = await User.findById({ _id });
    if (!userObj) return null;
    userObj.logs.push(obj);
    userObj.save((err) => {
        if (err) return console.error(err);
    });
    return userObj.username;
};

const getUserLogs = async (_id) => {
    const userObj = await User.findById({ _id });
    if (!userObj) return null;
    return userObj;
};

exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.addExercise = addExercise;
exports.getUserLogs = getUserLogs;
