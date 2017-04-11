"use strict"

const fs = require('fs-promise')

module.exports = function(config) {
    config.challenge = JSON.parse(fs.readFileSync("challenge.json", { encoding: "utf8" }))
}
