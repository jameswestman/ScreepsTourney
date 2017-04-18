"use strict"

const simple_border = require('./simple_border')
const fs = require('fs-promise')
const path = require('path')

module.exports = function(config) {
    var roomTerrain = config.challenge.rules.terrain
    var roomObjects = config.challenge.rules.objects

    var db = config.common.storage.db
    var env = config.common.storage.env
    var C = config.common.constants

    config.cli.on("cliSandbox", sb => {
        var challenge = {}

        function applyTemplate(room, terrain, objects) {
            if(!terrain) throw "Room template does not specify terrain"

            db["rooms.terrain"].update({ room: room }, { $set: { terrain: terrain } })

            db["rooms.objects"].removeWhere({ room: room })

            if(objects) {
                for(let obj of objects) {
                    var clone = JSON.parse(JSON.stringify(obj))
                    clone.room = room
                    db["rooms.objects"].insert(clone)
                }
            }

            sb.map.updateRoomImageAssets(room)
        }

        /**
         * Applies the room template for a center room to the given room
         */
        function applyCenterRoomTemplate(room) {
            applyTemplate(room, simple_border, [
                {
                    "type": "controller",
                    "x": 24,
                    "y": 24
                },
                {
                    "type": "terminal",
                    "x": 25,
                    "y": 25,
                    user: config.NPC_USER_ID
                },
            ]);
        }

        /**
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
            sb.map.generateRoom(room)
            applyTemplate(room, roomTerrain, roomObjects)
        }

        var sector = [2, -1]
        var nextRoom = 7
        const directions = [  [-1, -1], [-1,  0], [-1,  1],  [ 0, -1], [ 0,  1],  [ 1, -1], [ 1,  0], [ 1,  1]  ]

        function addPlayer(id, submission) {
            // set next room name
            nextRoom ++
            if(nextRoom === directions.length) {
                nextRoom = 0
                sector[1] += 3
                applyCenterRoomTemplate(`W${ sector[0] }N${ sector[1] }`)
            }

            // get room name
            var room = `W${ sector[0] + directions[nextRoom][0] }N${ sector[1] + directions[nextRoom][1] }`
            sb.print(sector)

            // create user
            db["users"].insert({
                _id: id,
                username: submission.username,
                usernameLower: submission.username.toLowerCase(),
                gcl: 1,
                cpu: config.challenge.rules.cpu || 30,
                active: true,
                cpuAvailable: 10000,
                registeredDate: new Date(),
                badge: {
                    type: 11,
                    color1: '#c03a64',
                    color2: '#9cbc0d',
                    color3: '#d17336',
                    flip: true,
                    param: 31
                }
            })

            // add code
            db["users.code"].insert({
                user: id,
                modules: submission.code,
                activeWorld: true,
                activeSim: true,
                branch: "world"
            })

            // set memory
            env.set(env.keys.MEMORY + id, "{}")

            // set up room terrain
            applyRoomTemplate(room)

            // apply mineral setting, if applicable
            if(config.challenge.rules.allowChooseMineral && submission.settings.mineral) {
                db["rooms.objects"].update({ $and: [{ type: "mineral" }, { room: room }] }, { $set: { mineralType: submission.settings.mineral } })
            }

            // own controller
            db["rooms.objects"].update({ $and: [{ type: "controller" }, { room: room }] }, { $set: { user: id, level: 1 } })

            // create spawn
            db["rooms.objects"].insert({
                type: "spawn",
                user: id,
                room: room,
                x: parseInt(submission.settings.spawn.x),
                y: parseInt(submission.settings.spawn.y),
                name: "Spawn1",

                energy: C.SPAWN_ENERGY_START,
                energyCapacity: C.SPAWN_ENERGY_CAPACITY,
                hits: C.SPAWN_HITS,
                hitsMax: C.SPAWN_HITS,

                spawning: null,
                notifyWhenAttacked: false
            })
        }

        function removeDefaultBots() {
            sb.bots.removeUser("MichaelBot")
            sb.bots.removeUser("EmmaBot")
            sb.bots.removeUser("AliceBot")
            sb.bots.removeUser("JackBot")
        }

        function setup() {
            sb.system.pauseSimulation()

            config.challengeAPI.status("Adding scripts to game world")

            // remove the obnoxous default bots
            removeDefaultBots()

            // create user to own NPC terminals
            db["users"].insert({
                _id: config.NPC_USER_ID,
                username: "NPC",
                usernameLower: "npc",
                gcl: 0,
                cpu: 0
            })

            // add users
            var scripts = fs.readdirSync("scripts")
            for(let filename of scripts) {
                var submission = JSON.parse(fs.readFileSync(path.join("scripts", filename)))
                var id = filename.replace(/\.json$/, "")
                addPlayer(id, submission)
            }

            // important! update terrain data so pathfinding works
            sb.map.updateTerrainData()

            // if forcing GC is allowed, do so
            if(global.gc) global.gc()
        }

        sb.setup = setup

        sb.begin = function() {
            return config.common.storage.env.get(config.common.storage.env.keys.GAMETIME)
            .then(time => config.challengeAPI.status("~START", undefined, time))
            .then(() => sb.system.resumeSimulation())
        }
    })
}
