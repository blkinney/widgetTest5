var eventPass = Alloy.createCollection('events');

var widget = Alloy.createWidget('eventCalendar', 'widget', {events: eventPass});

$.index.add(widget.getView());

$.index.open();
