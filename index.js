#!/usr/bin/env node

/**
* Arguments:
* --location: The directory in which to install the server
* --interface: The URL of the web interface
* --apikey: The password for the web interface
*/

"use strict";

const yargs = require('yargs')
const _ = require('lodash')
const fs = require('fs-promise')
const webinterface = require('./src/webinterface')
const path = require('path')
const child_process = require('child_process')

var args = yargs.argv

var api = new webinterface(args.interface, args.apikey)

function log(value, progress) {
    api.status(value, progress)
    console.log(value)
}

var dir = args.location || "./"

// make the mods and scripts directories
try {
    fs.mkdirSync(path.join(dir, "mods"))
} catch(err) {}
try {
    fs.mkdirSync(path.join(dir, "scripts"))
} catch(err) {}

var challenge
var mods = {
    mods: [],
    bots: {}
}

// download and save challenge
log("Downloading challenge info")
api.getChallenge()
.then(_challenge => {
    challenge = _challenge
    challenge.interface = args.interface
    challenge.apikey = args.apikey
    fs.writeFile(path.join(dir, "challenge.json"), JSON.stringify(challenge = _challenge))
})
.then(() => log("Downloading submissions"))
// download submission list
.then(() => api.getSubmissionList())
.then(submissions => Promise.all(
    _.map(submissions, id =>
        api.getSubmission(id)
        .then(submission =>
            fs.writeFile(path.join(dir, "scripts", id + ".json"), JSON.stringify(submission))
        )
    )
))
// install mods
.then(() => log("Installing mods"))
.then(() =>
    Promise.all(_.map(challenge.mods || {}, (mod, name) =>
        new Promise((resolve, reject) => {
            mods.mods.push(path.join(dir, "mods", name, "index.js"))
            var git = child_process.exec("git", ["clone", mod, path.join(dir, "mods", name)])
            git.on("exit", resolve)
        })
    ))
)
.then(() => mods.mods.push(path.join(__dirname, "src", "mod", "index.js")))
// write mods file
.then(() => fs.writeFile(path.join(dir, "mods.json"), JSON.stringify(mods)))
// .catch(err => console.log(err))
