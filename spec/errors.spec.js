var fs = require('fs');
var should = require('should');
var parser = require('../lib/main.js');

describe('parsing simple errors', function(){
	var stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/1_simple.txt');
	});
	it('should return an object', function(){
		var output = parser.parseString(stdout);

		output.length.should.equal(1);
		output[0].filename.should.equal('HolidayButton.cpp');
		output[0].line.should.equal(4);
		output[0].column.should.equal(37);
		output[0].type.should.equal('fatal error');
		output[0].text.should.equal('SparkButton/SparkButton.h: No such file or directory');
		output[0].code.should.equal('void onCheer(const char *topic, const char *data);');
		output[0].adjustedColumn.should.equal(36);
	});
});

describe('parsing multiple errors', function(){
	var stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/2_multiple.txt');
	});
	it('should return an object', function(){
		var output = parser.parseString(stdout);

		output.length.should.equal(5);
		for (i=0; i<5; i++) {
			output[i].filename.should.equal('Blink.cpp');
		}
	});
});

describe('parsing advanced errors', function(){
	var stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/3_advanced.txt');
	});
	it('should return an object', function(){
		var output = parser.parseString(stdout);
		// TODO: Parse inclusion stack
		output.length.should.equal(3);
		output[0].type.should.equal('error');
		output[1].type.should.equal('note');
		output[2].type.should.equal('error');
	});
});
