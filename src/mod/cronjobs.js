"use strict"

module.exports = function(config) {
    var db = config.common.storage.db
    config.cronjobs.npcMarketUpdate = [
        10,
        function() {
            console.log("Refreshing market")
            var time

            config.common.storage.env.get(config.common.storage.env.keys.GAMETIME).then(gametime => time = parseInt(gametime))
            .then(gametime => time = gametime)
            .then(() => db["rooms.objects"].find({ $and: [{ type: "terminal" }, { user: config.NPC_USER_ID }] }))
            .then(terminals => {
                terminals.forEach(terminal => {
                    var orders = []

                    for(let resource in config.challenge.rules.market) {
                        console.log("Creating orders for " + resource)
                        orders.push({
                            created: time,
                            active: true,
                            type: "sell",
                            amount: 1000000,
                            remainingAmount: 1000000,
                            totalAmount: 1000000,
                            resourceType: resource,
                            price: config.challenge.rules.market[resource],
                            roomName: terminal.room
                        })
                        orders.push({
                            created: time,
                            active: true,
                            type: "buy",
                            amount: 1000000,
                            remainingAmount: 1000000,
                            totalAmount: 1000000,
                            resourceType: resource,
                            price: config.challenge.rules.market[resource],
                            roomName: terminal.room
                        })
                    }

                    db["market.orders"].removeWhere({ roomName: terminal.room })
                    .then(() => db["market.orders"].insert(orders))
                })
            })
        }
    ]
}
