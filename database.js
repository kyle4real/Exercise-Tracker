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
});
const exerciseSchema = new Schema({
    username: String,
    date: String,
    duration: Number,
    description: String,
});

// MODELS //
const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

// FUNCTIONS //
const addUser = async (username, uniqueId) => {
    // check if it already exists
    if (await User.findOne({ username }).exec()) return 1;
    // add it if it does not exist
    User.create({ username, _id: uniqueId });
    return 0;
};

const getAllUsers = async () => {
    return User.find({});
};

// const addExercise = async (_id, obj) => {
//     const userObj = await User.findOne({ _id }).exec();
//     if (!userObj) return null;
//     Exercise.create({
//         username: userObj.username,
//         date: obj.date,
//         duration: obj.duration,
//         description: obj.description,
//     });
//     return userObj.username;
// };

const addExercise = async (_id, obj) => {
    const userObj = await User.findOne({ _id }).exec();
};

const getUserLogs = async (_id) => {
    const userObj = await User.findOne({ _id }).exec();
    if (!userObj) return null;
    const arr = await Exercise.find({ username: userObj.username }, "date duration description");
    return [userObj, arr];
};

exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.addExercise = addExercise;
exports.getUserLogs = getUserLogs;
