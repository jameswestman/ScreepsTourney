"use strict";

const webinterface = require("./webinterface");

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

                    // remove user
                    db["rooms.objects"].removeWhere({ user: user._id });
                    db["users"].removeWhere({ _id: user._id });
                }
            });
        });
    });
}
