const express = require("express");
const weatherService = require('./../service/weather-service');
const router = express.Router();

router.get("/current", async (req, res) => {
    const weatherForToday = await weatherService.getWeatherForToday();
    res.status(200).json(weatherForToday);
});

router.get("/single/:day", async (req, res) => {
    console.log(`Getting weather for day ${req.params.day}`);
    const weatherForToday = await weatherService.getWeatherAtDay(req.params.day)
    res.status(200).json(weatherForToday);
});

router.get("/:day", async (req, res) => {
    const weatherForToday = await weatherService.getWeatherDayInRange(req.params.day, req.query.years)
    res.status(200).json(weatherForToday);
});

module.exports = router;
