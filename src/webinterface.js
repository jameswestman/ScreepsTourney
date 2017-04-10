"use strict";

/*
 * This file provides an interface with the web server side of the project.
 */

const http = require('http');

const GET = "GET";
const POST = "POST";
const PUT = "PUT";

function WebAPI(config) {
    this.makeRequest = function(method, path) {
        return request.post(`https://${config.host}${path}`)
        .then((err, res, body) => JSON.parse(body));
    }
}

WebAPI.prototype.getChallenge = function() {
    return makeRequest(GET, "/challenge");
};
WebAPI.prototype.getSubmissionList = function() {
    return makeRequest(GET, "/submission-list");
};

module.exports = WebAPI;
