'use strict';
var Message = require('./Message');

module.exports = {
	parseString: function parseString(stdout) {
		stdout = stdout.toString();

		var messages = [].concat(
			this.parseGcc(stdout),
			this.parseLinker(stdout)
		);

		return messages;
	},

	parseGcc: function parseGcc(stdout) {
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
			messages.push(new Message().fromGcc(match, stdout));
		}

		return messages;
	},

	parseLinker: function parseLinker(stdout) {
		var regex = /(.*):(\d+):\s(.*)\s(to|of)\s`(.*)'/g;

		var messages = [];
		var match = null;
		while (match = regex.exec(stdout)) {
			messages.push(new Message().fromLinker(match, stdout));
		}

		return messages;
	}
};
