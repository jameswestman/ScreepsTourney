"use strict";

const webinterface = require("./webinterface.js");
const removeUser = require("./removeuser.js")

module.exports.rcl = function(level, config) {
    var db = config.common.storage.db;

    db["rooms.objects"].find({ $and: [{ level: { $gte: level } }, { type: "controller" }]})
    .then(controllers => {
        controllers.forEach(controller => {
            db["users"].findOne({ _id: controller.user })
            .then(user => {
                if(user) {
                    config.engine.driver.getGameTime()
                    .then(time => {
                        webinterface.playerFinish(user.username, time);
                    });

                    removeUser(user._id, db);
                }
            });
        });
    });
}
