const mongoose = require("mongoose")

const Schema = mongoose.Schema

const GameSchema = new Schema({
    points: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    angle: {
        type: Number,
        required: true
    },
    isInBasket: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model("game", GameSchema)