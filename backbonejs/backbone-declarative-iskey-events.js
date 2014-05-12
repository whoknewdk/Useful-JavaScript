;(function () {
	var slice = Array.prototype.slice;

	function ifKeyIs(keyCode, method) {
		return function (e) {
			if (e.which === keyCode)
				method.apply(this, slice.apply(arguments));
		};
	}

	var delegateEvents = Backbone.View.prototype.delegateEvents,
		eventKeyNameSplitter = /^(\S+):iskey\((\d)\)\s(.*)$/;

	Backbone.View.prototype.delegateEvents = function (events) {
		if (!(events || (events = _.result(this, 'events'))))
			return this;

		for (var key in events) {
			var method = events[key],
				match = key.match(eventKeyNameSplitter);
			
			// Does key follow :iskey(...) schema?
			if (!match)
				continue;
			
			// Delete original key
			delete events[key];

			// Map method-key to function if not already a function
			if (!_.isFunction(method))
				method = this[method];

			if (!method)
				continue;

			// Add sanitized key
			var keyCode = parseInt(match[2], 10);
			events[match[1] + ' ' + match[3]] = ifKeyIs(keyCode, method);
		}

		// Run everything as normal
		delegateEvents.apply(this, slice.apply(arguments));

		return this;
	};
}());
