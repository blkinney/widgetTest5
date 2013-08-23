exports.definition = {
    config: {
        columns: {
            title: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "dummy"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("dummy", exports.definition, []);

collection = Alloy.C("dummy", exports.definition, model);

exports.Model = model;

exports.Collection = collection;