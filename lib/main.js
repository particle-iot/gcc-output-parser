
const Message = require('./Message');

module.exports = {
	parseString: function parseString(stdout) {
		stdout = stdout.toString();

		const messages = [].concat(
			this.parseGcc(stdout),
			this.parseLinker(stdout)
		);

		return messages;
	},

	parseGcc: function parseGcc(stdout) {
		const messages = [];
		let match = null;

		const deepRegex = /([^:^\n]+):(\d+):(\d+):\s(\w+\s*\w*):\s(.+)\n(\s+)\d*\s*[|]*\s*(.*)\s+[|]*\s*\^+/gm;
		//               ^          ^     ^       ^             ^     ^    ^               ^
		//               |          |     |       |             |     |    |               +- affected code
		//               |          |     |       |             |     |    +- optional gcc 9.2 markup
		//               |          |     |       |             |     +- whitespace before code
		//               |          |     |       |             +- message text
		//               |          |     |       +- type (error|warning|note)
		//               |          |     +- column
		//               |          +- line
		//               +- filename
		/* eslint-disable-next-line */
		while (match = deepRegex.exec(stdout)) {
			messages.push(new Message().fromGcc(match, stdout));
		}

		const simpleRegex = /([^:^\n]+):(\d+):(\d+):\s(\w+\s*\w*):\s(.+)\n(?!\s)/gm;
		//                 ^          ^     ^       ^             ^     ^
		//                 |          |     |       |             |     |
		//                 |          |     |       |             |     +- whitespace before code
		//                 |          |     |       |             +- message text
		//                 |          |     |       +- type (error|warning|note)
		//                 |          |     +- column
		//                 |          +- line
		//                 +- filename
		match = null;
		/* eslint-disable-next-line */
		while (match = simpleRegex.exec(stdout)) {
			messages.push(new Message().fromGcc(match, stdout));
		}

		return messages;
	},

	parseLinker: function parseLinker(stdout) {
		const regex = /(.*):(\d+):\s(.*)\s(to|of)\s`(.*)'/g;

		const messages = [];
		let match = null;
		/* eslint-disable-next-line */
		while (match = regex.exec(stdout)) {
			messages.push(new Message().fromLinker(match, stdout));
		}

		return messages;
	}
};
