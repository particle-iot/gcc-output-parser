'use strict';

var Message = function Message(components, stdout) {
	if (typeof components[8] === 'undefined') {
		this.filename = components[1];
		this.line = parseInt(components[2]);
		this.column = parseInt(components[3]);
		this.type = components[4];
		this.text = components[5];
		this.codeWhitespace = components[6];
		this.code = components[7];

		this.adjustedColumn = this.column - this.codeWhitespace.length;
		this.startIndex = stdout.indexOf(components[0]);
		this.endIndex = this.startIndex + components[0].length;
	}

	return this;
};

module.exports = Message;
