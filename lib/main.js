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
		var messages = [];
		var match = null;

		var deepRegex = /([^:^\n]+):(\d+):(\d+):\s(\w+\s*\w*):\s(.+)\n(\s+)\d*\s*[|]*\s*(.*)\s+[|]*\s*\^+/gm;
		//               ^          ^     ^       ^             ^     ^    ^               ^
		//               |          |     |       |             |     |    |               +- affected code
		//               |          |     |       |             |     |    +- optional gcc 9.2 markup
		//               |          |     |       |             |     +- whitespace before code
		//               |          |     |       |             +- message text
		//               |          |     |       +- type (error|warning|note)
		//               |          |     +- column
		//               |          +- line
		//               +- filename
		while (match = deepRegex.exec(stdout)) {
			messages.push(new Message().fromGcc(match, stdout));
		}

		var simpleRegex = /([^:^\n]+):(\d+):(\d+):\s(\w+\s*\w*):\s(.+)\n(?!\s)/gm;
		//                 ^          ^     ^       ^             ^     ^
		//                 |          |     |       |             |     |
		//                 |          |     |       |             |     +- whitespace before code
		//                 |          |     |       |             +- message text
		//                 |          |     |       +- type (error|warning|note)
		//                 |          |     +- column
		//                 |          +- line
		//                 +- filename
		match = null;
		while (match = simpleRegex.exec(stdout)) {
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
