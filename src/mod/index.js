"use strict"

const fs = require('fs-promise');
const path = require('path');

module.exports = function(config) {
    require("./common")(config)
    if(config.backend) require("./backend")(config)
    if(config.engine) require("./engine")(config)
}
