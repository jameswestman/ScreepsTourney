"use strict";

const webinterface = require("./webinterface.js");
const removeUser = require("./removeuser.js");

module.exports.time = function(limit, config) {
    var db = config.common.storage.db;

    var env = config.common.storage.env;
    env.get(env.keys.GAMETIME)
    .then(time => {
        if(time > limit) {
            db["users"].find()
            .then(users => {
                users.forEach(user => {
                    webinterface.playerFinish(user.username, -1);
                    removeUser(user._id, db);
                });
            });
        }
    });
}
