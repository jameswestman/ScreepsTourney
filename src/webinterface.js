"use strict";

/*
 * This file provides an interface with the web server side of the project.
 */

const http = require('http')
const request = require('request-promise-native');

const GET = "GET"
const POST = "POST"
const PUT = "PUT"

function WebAPI(url, passwd) {
    this.makeRequest = function(method, path, json, body) {
        var req = {
            url: `${url}${path}`,
            method: method,
            auth: {
                user: "processor",
                pass: passwd
            }
        }

        if(json) req.json = true
        if(body) {
            if(json) {
                req.body = body
            } else {
                req.form = body
            }
        }

        return request(req)
    }
}

WebAPI.prototype.getChallenge = function() {
    return this.makeRequest(GET, "/challenge", true)
}
WebAPI.prototype.getSubmissionList = function() {
    return this.makeRequest(GET, "/submission-list", true)
}
WebAPI.prototype.getSubmission = function(id) {
    return this.makeRequest(GET, "/submission/" + id, true)
}
WebAPI.prototype.status = function(status, progress) {
    return this.makeRequest(PUT, "/status", false, {
        status: status,
        progress: progress
    })
}
WebAPI.prototype.tickrate = function(tickrate) {
    return this.makeRequest(PUT, "/tickrate", false, {
        tickrate: tickrate
    })
}
WebAPI.prototype.roomHistory = function(data) {
    return this.makeRequest(POST, "/room-history/" + data.room, true, data)
};

module.exports = WebAPI
