const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    gameID: [String]
})

module.exports = mongoose.model("user", UserSchema)
