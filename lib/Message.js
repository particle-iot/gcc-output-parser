

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
