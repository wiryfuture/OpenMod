const config = require('dotenv').config();
const mongoose = require("mongoose");

// Server Schema
var serverschema = new mongoose.Schema({
    serveruuid: {type: String},
    //erveruuid: {type: String},
    datejoined: {type: Date, default: Date.now},
    prefix: {type: String, default: "!"},
    logging: {type: Boolean, default: false},
    logging_channel: {type: String, default: ""},
    modrole: {type: String, default: "Moderator"},
    dowelcomemessage: {type: Boolean, default: false},
    welcome_channel: {type: String, default: ""},
    welcome_message: {type: String, default: "Say hello to {{user}}!"},
    filterlanguage: {type: Boolean, default: false},
    filterlanguage_level: {type: String, default: "slurs"},
    filterlanguage_custom: {type: Array, default: "frick"}
});
// Server model (for CRUD)
var servermodel = mongoose.model("server", serverschema);

module.exports = {
    upload: function() {

    },
    get: async function(uuid, setting) {
        // Connects to db
        return new Promise((resolve, reject) => {
            mongoose.connect(process.env.databaseurl, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open", function () {
                // Finds the server with provided uuid and returns the piece of data that was requested    
                servermodel.findOne( {"serveruuid": uuid } , setting, function (err, data) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else {
                        resolve(data[setting]);
                    }
                });
            });
        });
    },
    getall: async function(uuid) { // Avoid use if possible for smaller memory footprint
        // Connects to db
        return new Promise((resolve, reject) => {
            mongoose.connect(process.env.databaseurl, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open", function () {
                // Finds the server with provided uuid and returns all the data available (avoid use if possible)
                servermodel.findOne({ "serveruuid": uuid }, function (err, data) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else {
                        resolve(data);
                    }
                });
            });
        });
    },
    // Create a new document for a server using its uuid
    newserver: async function(uuid) {
        return new Promise((resolve, reject) => {
            // Connect to db
            mongoose.connect(process.env.databaseurl, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open", function () {
                // Create server model
                var genericserverdoc = new servermodel({"serveruuid": uuid})
                //genericserverdoc.serveruuid = uuid;
                // creates new entry under server with server uuid and defaults
                genericserverdoc.save(function (err) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    },
    // Delete a guild's document (for when the bot leaves a guild)
    deleteserver: async function(uuid) {
        return new Promise((resolve, reject) => {
            // Connect to db
            mongoose.connect(process.env.databaseurl, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open",function () {
                servermodel.deleteOne( {"serveruuid": uuid }, function (err) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    },
    set: async function(uuid, setting, value) {
        return new Promise((resolve, reject) => {
            // Connect to db
            mongoose.connect(process.env.databaseurl, {useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open", function () {
                servermodel.updateOne( {"serveruuid": uuid}, {[setting]: value}, function (err) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }
}
