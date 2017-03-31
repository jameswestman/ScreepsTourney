"use strict";

module.exports = function removeUser(id, db) {
    db["rooms.objects"].removeWhere({ user: id });
    db["users"].removeWhere({ _id: id });
}
