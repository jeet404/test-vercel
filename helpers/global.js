/**
 * Define here all helpers file as global variable
 */

// Provide success and error related response method
if (!global.RESPONSE) global.RESPONSE = require("./response.js");

// Provide file manipulation related functions
if (!global.FILEACTION) global.FILEACTION = require("./files");

// ProvideFunctions
if (!global.FUNCTIONS) global.FUNCTIONS = require("./functions.js");

// Provide assets url functions
if (!global.ASSETS) global.ASSETS = require("./assets.js");

// Provide mail related functions
if (!global.MAIL) global.MAIL = require("./mail.js");
