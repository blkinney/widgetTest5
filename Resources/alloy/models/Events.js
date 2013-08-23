var moment = require("moment");

exports.definition = {
    config: {
        columns: {
            title: "text",
            place: "text",
            street: "text",
            citZip: "text",
            addr: "text",
            time: "text",
            end: "text",
            phone: "text",
            location: "text",
            description: "text",
            email: "text",
            twitter: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "events"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            thisWeek: function(currentDay, currentDayNext) {
                Ti.API.info("First day of this week: " + currentDay.calendar());
                Ti.API.info("Last day of this week: " + currentDayNext.calendar());
                this.fetch({
                    query: "SELECT * FROM events WHERE time BETWEEN " + currentDay.unix() + " AND " + currentDayNext.unix()
                });
                return this;
            }
        });
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("events", exports.definition, [ function(migration) {
    migration.name = "events";
    migration.id = "201307081310907";
    var preload = [ {
        title: "Super Cool Event One",
        place: "Fishers Library",
        street: "Five Municipal Drive",
        citZip: "Fishers, IN 46038",
        addr: "Fishers Library Five Municipal Drive Fishers, IN 46038",
        time: "1376294400",
        end: "1376298000",
        phone: "(111) 555-4444",
        location: "Cool Place",
        description: "Description One",
        email: "dude@gmail.com",
        twitter: "@thedude"
    }, {
        title: "Super Cool Event Two",
        place: "Launch Fishers",
        street: "Five Municipal Drive",
        citZip: "Fishers, IN 46038",
        addr: "Fishers Library Five Municipal Drive Fishers, IN 46038",
        time: "1377129601",
        end: "1377136801",
        phone: "(222) 555-4444",
        location: "Super Cool Place",
        description: "Description Two",
        email: "guy@gmail.com",
        twitter: "@theguy"
    } ];
    migration.up = function(db) {
        db.createTable({
            columns: {
                title: "text",
                place: "text",
                street: "text",
                citZip: "text",
                addr: "text",
                time: "text",
                end: "text",
                phone: "text",
                location: "text",
                description: "text",
                email: "text",
                twitter: "text"
            }
        });
        for (var i = 0; preload.length > i; i++) db.insertRow(preload[i]);
    };
    migration.down = function() {};
} ]);

collection = Alloy.C("events", exports.definition, model);

exports.Model = model;

exports.Collection = collection;