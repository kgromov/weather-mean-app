const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    morningTemperature: Number,
    afternoonTemperature: Number,
    eveningTemperature: Number,
    nightTemperature: Number
}, { collection : 'weather-archieve' });

exports.temperatureSchema = temperatureSchema;
exports.DailyTemperature = mongoose.model('DailyTemperature', temperatureSchema);
