"use strict"

const fs = require('fs-promise')
const webinterface = require('../webinterface')
const _ = require('lodash');

module.exports = function(config) {
    config.challenge = JSON.parse(fs.readFileSync("challenge.json", { encoding: "utf8" }))
    config.challengeAPI = new webinterface(config.challenge.interface, config.challenge.apikey)
    config.NPC_USER_ID = "9"

    _.extend(config.common.constants, config.challenge.rules.constants || {})
}
