const mongoose = require("mongoose");
const DailyTemperature = require("./../model/dayli-temperature").DailyTemperature;

// =========== summary ==============
exports.getWeatherForToday = async function () {
    const currentDate = new Date().toISOString().slice(0, 10);
    const result = await DailyTemperature.findOne({data: currentDate});
    console.log(`weather for ${currentDate}: ${result}`);
    return result;
}

exports.getWeatherAtDay = async function (day) {
    const result = await DailyTemperature.findOne({data: day});
    console.log(`weather for ${day}: ${result}`);
    return result;
}

exports.getWeatherDayInRange = async function (day, years) {
    // TODO: format or add leading 0
    const date = new Date(day);
    const dayMonth = '-' + (date.getMonth() + 1) + '-' + String(date.getDate()).padStart(2, '0');
    console.log(`dayMonth = ${dayMonth}`);
    const result = await DailyTemperature.find({date: {$regex: dayMonth}})
        .sort({"date": -1})
        .limit(years || Number.MAX_SAFE_INTEGER);
    console.log(`weather for ${day} in ${years | 13} years: ${result}`);
    return result;
}
