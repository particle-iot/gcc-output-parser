(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GccOutputParser = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


function Message() {}

Message.prototype.fromGcc = function fromGcc(components, stdout) {
	this.filename = components[1];
	this.line = parseInt(components[2]);
	this.column = parseInt(components[3]);
	this.type = components[4];
	this.text = components[5];
	this.codeWhitespace = components[6] ? components[6] : '';
	this.code = components[7] ? components[7] : '';

	this.adjustedColumn = this.column - this.codeWhitespace.length;
	this.startIndex = stdout.indexOf(components[0]);
	this.endIndex = this.startIndex + components[0].length;
	this.parentFunction = this._lookbackFunction(stdout, this.startIndex);

	return this;
};

Message.prototype.fromLinker = function fromGcc(components, stdout) {
	this.filename = components[1];
	this.line = parseInt(components[2]);
	this.column = 0;
	this.type = 'error';
	this.subtype = components[3];
	this.affectedSymbol = components[5];
	this.text = this.subtype + ' ' + components[4] + ' "' + this.affectedSymbol + '"';

	this.startIndex = stdout.indexOf(components[0]);
	this.endIndex = this.startIndex + components[0].length;
	this.parentFunction = this._lookbackFunction(stdout, this.startIndex);

	if (this.subtype === 'multiple definition') {
		this.firstDefined = this._lookupFirstDefinition(stdout, this.endIndex);
	}

	return this;
};

Message.prototype._matchAll = function _matchAll(regex, input) {
	let match = null;
	const matches = [];

	/* eslint-disable-next-line */
	while (match = regex.exec(input)) {
		matches.push(match);
	}
	return matches;
};

Message.prototype._lookbackFunction = function _lookbackFunction(stdout, index) {
	const regex = /In function\s(`|')(.*)'/g;
	const matches = this._matchAll(regex, stdout.slice(0, index));
	if (matches.length) {
		return matches.slice(-1)[0][2];
	}
	return;
};

Message.prototype._lookupFirstDefinition = function _lookupFirstDefinition(stdout, index) {
	const regex = /:(.*):(\d+): first defined here/g;

	const matches = this._matchAll(regex, stdout.slice(index));
	if (matches.length) {
		return {
			filename: matches[0][1],
			line: parseInt(matches[0][2])
		};
	}
	return;
};

module.exports = Message;

},{}],2:[function(require,module,exports){

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

},{"./Message":1}]},{},[2])(2)
});
