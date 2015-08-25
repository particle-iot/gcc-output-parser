'use strict';
var Message = require('./Message');

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
			messages.push(new Message(match, stdout));
		}

		return messages;
	}
};
