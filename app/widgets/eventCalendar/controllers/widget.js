var moment = require(WPATH('moment'));

var args = arguments[0] || {};
$.events = args.events;
var parentTab = args.parentTab;

$.events.trigger('change');

// $.title.text = args.title || 'YA BLEW IT';

var currentDay = moment().day(1);
var currentDayNext = moment().day(7);

$.events.thisWeek(currentDay, currentDayNext);

debugger;

$.weekLabel.text = currentDay.format("MMMM DD") + ' - ' + currentDayNext.format("MMMM DD");

function updateUI() {
}

$.table.addEventListener('click', function(_e) {
    var detailController = Widget.createController('event_detail', {
        parentTab : parentTab,
        data : $.events.at(_e.index)
    });
    parentTab.open(detailController.getView());
});

function doClickNext(e){
    currentDay.add('days', 7);
    currentDayNext.add('days', 7);
    $.weekLabel.text = currentDay.format("MMMM DD") + ' - ' + currentDayNext.format("MMMM DD");
    // $.events.forParentAndTime(container.get('id'), currentDay, currentDayNext);
};

function doClickPrev(e){
    currentDay.subtract('days', 7);
    currentDayNext.subtract('days', 7);
    $.weekLabel.text = currentDay.format("MMMM DD") + ' - ' + currentDayNext.format("MMMM DD");
    // $.events.forParentAndTime(container.get('id'), currentDay, currentDayNext);
};
