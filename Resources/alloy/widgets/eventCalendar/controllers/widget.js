function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "eventCalendar/" + s : s.substring(0, index) + "/eventCalendar/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function updateUi() {
        updateUi.opts || {};
        var models = __alloyId12.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId0 = models[i];
            __alloyId0.__transform = {};
            var __alloyId1 = Ti.UI.createTableViewRow({
                height: 70,
                selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE
            });
            rows.push(__alloyId1);
            var __alloyId2 = Ti.UI.createView({});
            __alloyId1.add(__alloyId2);
            var __alloyId3 = Ti.UI.createView({
                top: 0,
                left: 0,
                width: 70
            });
            __alloyId2.add(__alloyId3);
            var __alloyId4 = Ti.UI.createImageView({
                top: 10,
                left: 10,
                image: "event_small_icon.png"
            });
            __alloyId3.add(__alloyId4);
            var __alloyId5 = Ti.UI.createLabel({
                top: 14,
                left: 22,
                color: "#ffffff",
                font: {
                    fontSize: 14
                }
            });
            __alloyId3.add(__alloyId5);
            var __alloyId6 = Ti.UI.createLabel({
                top: 25,
                left: 22,
                color: "#ffffff",
                font: {
                    fontSize: 30,
                    fontWeight: "bold"
                }
            });
            __alloyId3.add(__alloyId6);
            var __alloyId7 = Ti.UI.createView({
                top: 0,
                left: 70,
                right: 10
            });
            __alloyId2.add(__alloyId7);
            var __alloyId8 = Ti.UI.createLabel({
                top: 2,
                left: 2,
                right: 20,
                height: 40,
                textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                minimumFontSize: 15,
                font: {
                    fontSize: 15,
                    fontWeight: "bold"
                },
                text: "test"
            });
            __alloyId7.add(__alloyId8);
            var __alloyId9 = Ti.UI.createLabel({
                top: 35,
                left: 20,
                font: {
                    fontSize: 14
                }
            });
            __alloyId7.add(__alloyId9);
            var __alloyId10 = Ti.UI.createLabel({
                top: 50,
                left: 20,
                font: {
                    fontSize: 14
                }
            });
            __alloyId7.add(__alloyId10);
            var __alloyId11 = Ti.UI.createImageView({
                top: 0,
                bottom: 0,
                right: 0,
                image: "right_arrow.png"
            });
            __alloyId2.add(__alloyId11);
        }
        $.__views.table.setData(rows);
    }
    function doClickNext() {
        currentDay.add("days", 7);
        currentDayNext.add("days", 7);
        $.weekLabel.text = currentDay.format("MMMM DD") + " - " + currentDayNext.format("MMMM DD");
    }
    function doClickPrev() {
        currentDay.subtract("days", 7);
        currentDayNext.subtract("days", 7);
        $.weekLabel.text = currentDay.format("MMMM DD") + " - " + currentDayNext.format("MMMM DD");
    }
    var Widget = new (require("alloy/widget"))("eventCalendar");
    this.__widgetId = "eventCalendar";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.events = Widget.createCollection("dummy");
    $.__views.win = Ti.UI.createWindow({
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.weekView = Ti.UI.createView({
        top: 0,
        left: 0,
        height: Ti.UI.SIZE,
        id: "weekView"
    });
    $.__views.win.add($.__views.weekView);
    $.__views.previousImage = Ti.UI.createImageView({
        top: 0,
        left: 10,
        id: "previousImage",
        image: "left_arrow.png"
    });
    $.__views.weekView.add($.__views.previousImage);
    doClickPrev ? $.__views.previousImage.addEventListener("click", doClickPrev) : __defers["$.__views.previousImage!click!doClickPrev"] = true;
    $.__views.weekLabel = Ti.UI.createLabel({
        left: 0,
        right: 0,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: 16,
            fontWeight: "bold"
        },
        id: "weekLabel"
    });
    $.__views.weekView.add($.__views.weekLabel);
    $.__views.nextImage = Ti.UI.createImageView({
        top: 0,
        right: 10,
        id: "nextImage",
        image: "right_arrow.png"
    });
    $.__views.weekView.add($.__views.nextImage);
    doClickNext ? $.__views.nextImage.addEventListener("click", doClickNext) : __defers["$.__views.nextImage!click!doClickNext"] = true;
    $.__views.borderImage = Ti.UI.createImageView({
        right: 0,
        bottom: 0,
        id: "borderImage",
        image: "separator.png"
    });
    $.__views.weekView.add($.__views.borderImage);
    $.__views.table = Ti.UI.createTableView({
        top: 45,
        id: "table"
    });
    $.__views.win.add($.__views.table);
    var __alloyId12 = Widget.Collections["$.events"] || $.events;
    __alloyId12.on("fetch destroy change add remove reset", updateUi);
    exports.destroy = function() {
        __alloyId12.off("fetch destroy change add remove reset", updateUi);
    };
    _.extend($, $.__views);
    var moment = require(WPATH("moment"));
    var args = arguments[0] || {};
    $.events = args.events;
    var parentTab = args.parentTab;
    $.events.trigger("change");
    var currentDay = moment().day(1);
    var currentDayNext = moment().day(7);
    $.events.thisWeek(currentDay, currentDayNext);
    debugger;
    $.weekLabel.text = currentDay.format("MMMM DD") + " - " + currentDayNext.format("MMMM DD");
    $.table.addEventListener("click", function(_e) {
        var detailController = Widget.createController("event_detail", {
            parentTab: parentTab,
            data: $.events.at(_e.index)
        });
        parentTab.open(detailController.getView());
    });
    __defers["$.__views.previousImage!click!doClickPrev"] && $.__views.previousImage.addEventListener("click", doClickPrev);
    __defers["$.__views.nextImage!click!doClickNext"] && $.__views.nextImage.addEventListener("click", doClickNext);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;