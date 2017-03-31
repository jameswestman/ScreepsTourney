#!/usr/local/bin/node

"use strict";

const path = require('path');
const fs = require('fs');

/*
 * This script downloads the list of players and their code, then outputs a
 * mods.json with each player represented as a bot
 */

var mods = {
    mods: [
        "../src/main.js"
    ],
    bots: {}
}

// todo: actually download stuff

var challenge = {
    cpu: 10,
    gcl: 1,

    winConditions: {
        "rcl": 1
    }
}

fs.writeFile("../server/challenge.json", JSON.stringify(challenge), () => {
});

var playerlist = [
    {
        name: "FlyingPiMonster",
        id: "1",
        email: "flyingpimonster@flyingpimonster.net",
        opts: {
            x: 2,
            y: 2
        }
    }
];

for(let player of playerlist) {
    mods.bots[player.name] = path.join("../server/playercode", player.id);
    fs.mkdirSync(path.join("../server/playercode", player.id))
    fs.closeSync(fs.openSync(path.join("../server/playercode", player.id, "main.js"), 'a'));
}

fs.writeFile("../server/players.json", JSON.stringify(playerlist), () => {
});

console.log(JSON.stringify(mods));
