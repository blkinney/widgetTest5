function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "eventCalendar/" + s : s.substring(0, index) + "/eventCalendar/" + s.substring(index + 1);
    return path;
}

function Controller() {
    new (require("alloy/widget"))("eventCalendar");
    this.__widgetId = "eventCalendar";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "event_detail";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.event_detail = Ti.UI.createView({
        backgroundColor: "white",
        id: "event_detail"
    });
    $.__views.event_detail && $.addTopLevelView($.__views.event_detail);
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("settings");
    var moment = require("moment");
    var args = arguments[0] || {};
    var data = args.data;
    args.parentTab;
    var skipProperties = [ "phone", "tags", "offer" ];
    $.event_detail.title = data.get("name");
    if (Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "title_bar_logo.png").exists()) {
        $.event_detail.title = "";
        $.event_detail.barImage = "title_bar_logo.png";
    } else $.event_detail.barImage = "title_bar.png";
    var backButton = Ti.UI.createButton({
        title: "",
        width: 44,
        height: 44,
        backgroundImage: "left_arrow.png"
    });
    backButton.addEventListener("click", function() {
        $.event_detail.close({
            animated: "true"
        });
        $.destroy();
    });
    $.event_detail.leftNavButton = backButton;
    $.nameLabel.text = data.get("name");
    var date = moment(data.get("start_time"), "YYYY-MM-DDTHH:mm:ssZ");
    $.monthLabel.text = date.format("MMM");
    $.dayLabel.text = date.format("DD");
    $.startLabel.text = date.format("hh:mm a on MM/DD");
    var dateEnd = moment(data.get("end_time"), "YYYY-MM-DDTHH:mm:ssZ");
    if (dateEnd && dateEnd.isValid()) $.endLabel.text = dateEnd.format("hh:mm a on MM/DD"); else {
        $.endView.visible = false;
        $.endView.height = 0;
        $.endLabel.height = 0;
    }
    var tr = Ti.UI.create2DMatrix();
    tr = tr.rotate(90);
    $.dowLabel.text = date.format("ddd").toUpperCase();
    $.dowLabel.transform = tr;
    var properties = JSON.parse(data.get("properties"));
    if (properties.phone) $.phoneLabel.text = properties.phone; else {
        $.phoneView.visible = false;
        $.phoneView.height = 0;
        $.phoneLabel.height = 0;
    }
    var address = Alloy.createCollection("address").forParent(data.get("id")).at(0);
    address && ($.addressLabel.text = (null == address.get("street") ? "" : address.get("street")) + "\n" + (null == address.get("city") ? "" : address.get("city") + ",") + " " + (null == address.get("state") ? "" : address.get("state")) + " " + (null == address.get("zip") ? "" : address.get("zip")));
    $.descriptionLabel.text = data.get("description");
    _.each(properties, function(value, key) {
        if (!_.contains(skipProperties, key) && value) {
            Ti.API.debug("setting up : " + key);
            var header = Ti.UI.createLabel({
                text: key.charAt(0).toUpperCase() + key.slice(1),
                top: 10,
                left: 20,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: Alloy.Globals.fontColor,
                font: {
                    fontSize: 15,
                    textAlign: "left"
                }
            });
            $.propertiesView.add(header);
            var content = Ti.UI.createLabel({
                text: value,
                top: 10,
                left: 20,
                right: 20,
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: "black",
                font: {
                    fontSize: 16,
                    textAlign: "left"
                }
            });
            $.propertiesView.add(content);
        }
    });
    var properties = JSON.parse(data.get("properties"));
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;