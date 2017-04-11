"use strict"

module.exports = function(config) {
    config.challenge = JSON.parse(fs.readSync("challenge.json", { encoding: "utf8" }))
}
