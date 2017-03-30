"use strict";

/*
 * The main file for the Screeps Tourney mod.
 *
 * This mod sets up various command-line tools that can be used to manage the
 * Screeps Tournament. This includes automatic player setup, room terraforming,
 * and victory/failure conditions.
 */

module.exports = function(config) {
    var roomTemplate = require("../resources/room_templates/center_square");
    var db = config.common.storage.db;
    var sb;
    var challengeParams = {
        cpu: 10,
        gcl: 1
    };

    var roomnum = 0;

    /*
     * Applies the previously provided room template to the given room (which
     * should already exist).
     *
     * Room template:
     * - terrain: The terrain of the room, formatted as a 2500-character string,
     * where 0=empty, 1=natural wall, 2=swamp, 3=both (see TERRAIN_MASK
     * constants)
     * - objects: (optional) An array of objects. No objects will be in the room
     *   (not even sources or a controller!) if this is omitted.
     *   - x, y: The position of the object.
     *   - type: The type of object.
     *   - Other standard object properties are allowed, such as energy, store,
     *     etc. If room is specified, it is overwritten.
     */
    function applyRoomTemplate(room) {
        if(!roomTemplate.terrain) throw "Room template does not specify terrain";

        db["rooms.terrain"].update({ room: room }, { $set: { terrain: roomTemplate.terrain } });
        sb.map.updateRoomImageAssets(room);

        db["rooms.objects"].removeWhere({ room: room });

        if(roomTemplate.objects) {
            for(let i of roomTemplate.objects) {
                i.room = room;
                db["rooms.objects"].insert(i);
            }
        }
    }

    function addPlayer(name, x, y) {
        // create the player's room
        var room = "W" + Math.floor(roomnum / 10) + "N" + (roomnum % 10);
        roomnum ++;
        sb.map.generateRoom(room);
        applyRoomTemplate(room);

        // spawn the new player
        sb.bots.spawn(name, room, {
            username: name,
            cpu: challengeParams.cpu,
            gcl: challengeParams.gcl,
            x: x,
            y: y
        });
    }

    function setRoomTemplate(template) {
        roomTemplate = template;
    }

    function setChallengeParameter(name, value) {
        challengeParams[name] = value;
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
            addPlayer(p.name, p.opts.x, p.opts.y);
        }
    }

    if(config.cli) {
		config.cli.on("cliSandbox", sandbox => {
            sb = sandbox;
            sandbox.tourney = {
                addPlayer: addPlayer,
                setRoomTemplate: setRoomTemplate,
                setChallengeParameter: setChallengeParameter,
                removeDefaultBots: removeDefaultBots,
                loadAllPlayers: loadAllPlayers
            };
		});
    }

    if(config.engine) {
        config.engine.mainLoopMinDuration = 1;
    }
}
