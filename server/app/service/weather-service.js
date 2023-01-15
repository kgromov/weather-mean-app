const mongoose = require("mongoose");
const DailyTemperature = require("./../model/dayli-temperature").DailyTemperature;

// =========== summary ==============
exports.getWeatherForToday = async function () {
    const currentDate = new Date().toISOString()/*.slice(0, 10)*/;
    const result = await DailyTemperature.findOne({data: currentDate});
    console.log(`weather for ${currentDate}: ${result}`);
    return result;
}

exports.getWeatherAtDay = async function (day) {
    const result = await DailyTemperature.findOne({data: new Date(day)});
    console.log(`weather for ${day}: ${result}`);
    return result;
}

exports.getWeatherDayInRange_ = async function (day, years) {
    const date = new Date(day);
    const dayMonth = '-' + String((date.getMonth() + 1)).padStart(2, 0) + '-' + String(date.getDate()).padStart(2, '0');
    console.log(`dayMonth = ${dayMonth}`);
    const result = await DailyTemperature.find({date: {$regex: dayMonth}})
        .sort({"date": 1})
        .limit(years || Number.MAX_SAFE_INTEGER);
    console.log(`weather for ${day} in ${years | 13} years: ${result}`);
    return result;
}

exports.getWeatherDayInRange = async function (day, years) {
    console.log(`Request params: day = ${day}, years = ${years}`);
    const date = new Date(day);
    const dayMonth = '-' + String((date.getMonth() + 1)).padStart(2, 0) + '-' + String(date.getDate()).padStart(2, '0');
    console.log(`dayMonth = ${dayMonth}`);
    var pipeline = [
        {
            $project: {
                _id: 0,
                morningTemperature: 1,
                afternoonTemperature: 1,
                eveningTemperature: 1,
                nightTemperature: 1,
                date: {
                    $dateToString: {
                        date: "$date",
                        format: "%Y-%m-%d",

                    }
                }
            }
        },
        {
            $match: {
                date: {$regex: dayMonth}
            }
        },
        {$sort: {date: 1}},
        {$limit: +years || Number.MAX_SAFE_INTEGER}
    ];

    const result = await DailyTemperature.aggregate(pipeline);
    console.log(`weather for ${day} in ${years | 13} years: ${result}`);
    return result;
}

exports.getYearsToShow = async function () {
    console.log('getYearsToShow');
    var pipeline = [
        // {
        //     $project: {
        //         date: {
        //             $toDecimal: "$date",
        //         },
        //     },
        // },
        {
            $group: {
                _id: null,
                min_date: {
                    $min: "$date",
                },
                max_date: {
                    $max: "$date",
                },
            },
        },
        {
            $project: {
                min_date: {
                    $toDate: "$min_date",
                },
                max_date: {
                    $toDate: "$max_date",
                },
                diff: {
                    $dateDiff: {
                        startDate: "$min_date",
                        endDate: "$max_date",
                        unit: "year",
                    },
                },
            },
        },
    ];

    var pipelineLocal = [
        {
            $group: {
                _id: null,
                min_date: {
                    $min: "$date",
                },
                max_date: {
                    $max: "$date",
                },
            },
        },
        {
            $project: {
                minYear: {
                    $year: "$min_date",
                },
                maxYear: {
                    $year: "$max_date",
                }
            },
        },
    ];

    const result = await DailyTemperature.aggregate(pipelineLocal);
    console.log('weather for ' + JSON.stringify(result) + ' years');
    return result[0].maxYear - result[0].minYear + 1;
}



