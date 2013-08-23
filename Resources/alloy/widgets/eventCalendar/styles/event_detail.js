function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "eventCalendar/" + s : s.substring(0, index) + "/eventCalendar/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isClass: true,
    priority: 10000.0002,
    key: "container",
    style: {
        backgroundColor: "white"
    }
} ];