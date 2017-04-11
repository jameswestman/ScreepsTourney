"use strict";

/*
 * The main file for the Screeps Tourney mod.
 *
 * This mod sets up various command-line tools that can be used to manage the
 * Screeps Tournament. This includes automatic player setup, room terraforming,
 * and victory/failure conditions.
 */

const path = require("path");

module.exports = function(config) {
    var db = config.common.storage.db;
    var sb;
    var challengeParams = require("../server/challenge.json");
    var roomTemplate = require(path.join("../resources/room_templates/", challengeParams.roomTemplate));

    var roomnum = 0;

    function addPlayer(name, opts) {
        // create the player's room
        var room = "W" + Math.floor(roomnum / 10) + "N" + (roomnum % 10);
        roomnum ++;
        sb.map.generateRoom(room);
        applyRoomTemplate(room);

        // some challenges allow choosing the mineral type in the room
        if(challengeParams.allowChooseMineral && opts.mineral) {
            db["rooms.objects"].update({ $and: [{ type: "mineral" }, { room: room }] }, { $set: { mineralType: opts.mineral } });
        }

        // spawn the new player
        sb.bots.spawn(name, room, {
            username: name,
            cpu: challengeParams.cpu,
            gcl: challengeParams.gcl,
            x: opts.x,
            y: opts.y
        });
    }

    function removeDefaultBots() {
        sb.bots.removeUser("MichaelBot");
        sb.bots.removeUser("EmmaBot");
        sb.bots.removeUser("AliceBot");
        sb.bots.removeUser("JackBot");
    }

    function loadAllPlayers() {
        var playerlist = require("../server/players.json");

        for(let p of playerlist) {
            addPlayer(p.name, p.opts);
        }
    }

    if(config.cli) {
		config.cli.on("cliSandbox", sandbox => {
            sb = sandbox;
            sandbox.tourney = {
                load: function() {
                    sb.system.pauseSimulation();
                    removeDefaultBots();
                    loadAllPlayers();
                    sb.system.resumeSimulation();
                }
            };
		});
    }

    if(config.engine) {
        config.engine.mainLoopMinDuration = 1;
    }
}
