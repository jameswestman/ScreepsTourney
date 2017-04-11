"use strict"

const fs = require('fs-promise')
const webinterface = require('../webinterface')

module.exports = function(config) {
    config.challenge = JSON.parse(fs.readFileSync("challenge.json", { encoding: "utf8" }))
    config.challengeAPI = new webinterface(config.challenge.interface, config.challenge.apikey)
}
