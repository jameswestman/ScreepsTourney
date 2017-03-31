"use strict";

/*
 * This file provides an interface with the web server side of the project.
 */

exports.downloadPlayerData = function() {
};

exports.downloadPlayerCode = function(name) {
};

exports.uploadLogs = function(name, logs) {
};

exports.statusReport = function(data) {
};

exports.playerFinish = function(name, score) {
    console.log(name + " finished with a score of " + score);
};
