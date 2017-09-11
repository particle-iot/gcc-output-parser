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
		output[0].startIndex.should.equal(0);
		output[0].endIndex.should.equal(180);
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
		output[1].parentFunction.should.equal('void setup()');
		output[1].startIndex.should.equal(120);
		output[1].endIndex.should.equal(228);
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

describe('parsing linker errors', function(){
	var stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/6_linker.txt');
	});
	it('should return an object', function(){
		var output = parser.parseString(stdout);
		i = 3;
		output.length.should.equal(17);
		output[i].type.should.equal('error');
		output[i].subtype.should.equal('undefined reference');
		output[i].filename.should.equal('/workspace/dispatcher.cpp');
		output[i].line.should.equal(27);
		output[i].column.should.equal(0);
		output[i].text.should.equal('undefined reference to "vtable for Logger"');
		output[i].affectedSymbol.should.equal('vtable for Logger');
		output[i].parentFunction.should.equal('Dispatcher::setLog(Logger*)');

		i += 3;
		output[i].subtype.should.equal('multiple definition');
		output[i].parentFunction.should.equal('IntervalTimer::isAllocated_SIT()');
		output[i].firstDefined.filename.should.equal('SparkIntervalTimer.cpp');
		output[i].firstDefined.line.should.equal(61);
	});
});

describe('parsing 0.6.0 errors', function(){
	var stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/8_dray_0.6.0.txt');
	});
	it('should return an object', function(){
		var output = parser.parseString(stdout);

		output.length.should.equal(7);
		output[5].type.should.equal('error');
		output[5].filename.should.equal('emptyerror.ino');
		output[5].line.should.equal(23);
		output[5].column.should.equal(34);
		output[5].text.should.equal('\'count\' was not declared in this scope');
		output[6].type.should.equal('error');
		output[6].filename.should.equal('emptyerror.ino');
		output[6].line.should.equal(27);
		output[6].column.should.equal(5);
		output[6].text.should.equal('\'count\' was not declared in this scope');
	});
});
