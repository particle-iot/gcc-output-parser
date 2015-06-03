'use strict';
var Message = require('./message');

module.exports = {
	parseString: function parseString(stdout) {
		stdout = stdout.toString();
		var regex = /([^:^\n]+):(\d+):(\d+):\s(\w+\s*\w*):\s(.+)\n(\s+)(.*)\s+\^+/gm;
		//            ^          ^     ^       ^       ^     ^    ^
		//            |          |     |       |       |     |    +- affected code
		//            |          |     |       |       |     +- whitespace before code
		//            |          |     |       |       +- message text
		//            |          |     |       +- type (error|warning|note)
		//            |          |     +- column
		//            |          +- line
		//            +- filename

		var messages = [];
		var match = null;
		while (match = regex.exec(stdout)) {
			messages.push(new Message(match));
		}

		return messages;
	}
};
