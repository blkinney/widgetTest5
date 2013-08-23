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
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			
            thisWeek : function(currentDay, currentDayNext) {
                
                Ti.API.info("First day of this week: " + currentDay.calendar());
                Ti.API.info("Last day of this week: " + currentDayNext.calendar());
                
                this.fetch({query: "SELECT * FROM events WHERE time BETWEEN "+currentDay.unix()+" AND "+currentDayNext.unix()});
				return this;
            }
		});
		
		return Collection;
	}
}

