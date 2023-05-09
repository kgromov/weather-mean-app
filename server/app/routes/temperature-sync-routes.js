const express = require("express");
const temperatureService = require('./../service/temperature-service');
const router = express.Router();

router.get("/", async (req, res) => {
    await temperatureService.syncForToday();
})

module.exports = router;
