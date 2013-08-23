function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "eventCalendar/" + s : s.substring(0, index) + "/eventCalendar/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isId: true,
    priority: 100000.0004,
    key: "weekView",
    style: {
        top: 0,
        left: 0,
        height: Ti.UI.SIZE
    }
}, {
    isId: true,
    priority: 100000.0005,
    key: "previousImage",
    style: {
        top: 0,
        left: 10
    }
}, {
    isId: true,
    priority: 100000.0006,
    key: "nextImage",
    style: {
        top: 0,
        right: 10
    }
}, {
    isId: true,
    priority: 100000.0007,
    key: "borderImage",
    style: {
        right: 0,
        bottom: 0
    }
}, {
    isId: true,
    priority: 100000.0008,
    key: "weekLabel",
    style: {
        left: 0,
        right: 0,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontSize: 16,
            fontWeight: "bold"
        }
    }
}, {
    isId: true,
    priority: 100000.0009,
    key: "table",
    style: {
        top: 45
    }
}, {
    isId: true,
    priority: 100000.001,
    key: "event_row",
    style: {
        height: 70
    }
}, {
    isId: true,
    priority: 100000.0011,
    key: "event_date",
    style: {
        top: 0,
        left: 0,
        width: 70
    }
}, {
    isId: true,
    priority: 100000.0012,
    key: "dateImage",
    style: {
        top: 10,
        left: 10
    }
}, {
    isId: true,
    priority: 100000.0013,
    key: "date_dow",
    style: {
        top: 14,
        left: 22,
        color: "#ffffff",
        font: {
            fontSize: 14
        }
    }
}, {
    isId: true,
    priority: 100000.0014,
    key: "date_day",
    style: {
        top: 25,
        left: 22,
        color: "#ffffff",
        font: {
            fontSize: 30,
            fontWeight: "bold"
        }
    }
}, {
    isId: true,
    priority: 100000.0015,
    key: "event_description",
    style: {
        top: 0,
        left: 70,
        right: 10
    }
}, {
    isId: true,
    priority: 100000.0016,
    key: "title",
    style: {
        top: 2,
        left: 2,
        right: 20,
        height: 40,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        minimumFontSize: 15,
        font: {
            fontSize: 15,
            fontWeight: "bold"
        }
    }
}, {
    isId: true,
    priority: 100000.0017,
    key: "time",
    style: {
        top: 35,
        left: 20,
        font: {
            fontSize: 14
        }
    }
}, {
    isId: true,
    priority: 100000.0018,
    key: "location",
    style: {
        top: 50,
        left: 20,
        font: {
            fontSize: 14
        }
    }
}, {
    isId: true,
    priority: 100000.0019,
    key: "disclosureImage",
    style: {
        top: 0,
        bottom: 0,
        right: 0
    }
} ];