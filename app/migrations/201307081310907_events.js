var preload = [
	{title : "Super Cool Event One", place: "Fishers Library", street: "Five Municipal Drive", citZip: "Fishers, IN 46038", addr: "Fishers Library Five Municipal Drive Fishers, IN 46038", time : "1376294400", end : "1376298000", phone : "(111) 555-4444", location : "Cool Place", description : "Description One", email:"dude@gmail.com", twitter:"@thedude"},
	{title : "Super Cool Event Two", place: "Launch Fishers", street: "Five Municipal Drive", citZip: "Fishers, IN 46038", addr: "Fishers Library Five Municipal Drive Fishers, IN 46038", time : "1377129601", end : "1377136801", phone : "(222) 555-4444", location : "Super Cool Place", description : "Description Two", email:"guy@gmail.com", twitter:"@theguy"}
];

migration.up = function(db) {
	db.createTable({
		'columns': {
			'title' : 'text',
		    'place' : 'text',
		    'street' : 'text',
		    'citZip' : 'text',
		    'addr' : 'text',
		    'time' : 'text',
		    'end' : 'text',
		    'phone' : 'text',
		    'location' : 'text',
		    'description' : 'text',
		    'email': 'text',
		    'twitter': 'text'
		}
	});
	
	for (var i=0; i < preload.length; i++) {
		db.insertRow(preload[i]);
	}
};

migration.down = function(db) {

};
