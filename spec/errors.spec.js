const fs = require('fs');
const { expect } = require('chai');
const parser = require('../lib/main');

describe('parsing simple errors', function(){
	let stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/1_simple.txt');
	});
	it('should return an object', function(){
		const output = parser.parseString(stdout);

		expect(output.length).to.equal(1);
		expect(output[0].filename).to.equal('HolidayButton.cpp');
		expect(output[0].line).to.equal(4);
		expect(output[0].column).to.equal(37);
		expect(output[0].type).to.equal('fatal error');
		expect(output[0].text).to.equal('SparkButton/SparkButton.h: No such file or directory');
		expect(output[0].code).to.equal('void onCheer(const char *topic, const char *data);');
		expect(output[0].adjustedColumn).to.equal(36);
		expect(output[0].startIndex).to.equal(0);
		expect(output[0].endIndex).to.equal(180);
	});
});

describe('parsing multiple errors', function(){
	let stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/2_multiple.txt');
	});
	it('should return an object', function(){
		const output = parser.parseString(stdout);

		expect(output.length).to.equal(5);
		for (let i = 0; i < 5; i++) {
			expect(output[i].filename).to.equal('Blink.cpp');
		}
		expect(output[1].parentFunction).to.equal('void setup()');
		expect(output[1].startIndex).to.equal(120);
		expect(output[1].endIndex).to.equal(228);
	});
});

describe('parsing advanced errors', function(){
	let stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/3_advanced.txt');
	});
	it('should return an object', function(){
		const output = parser.parseString(stdout);
		// TODO: Parse inclusion stack
		expect(output.length).to.equal(3);
		expect(output[0].type).to.equal('error');
		expect(output[1].type).to.equal('note');
		expect(output[2].type).to.equal('error');
	});
});

describe('parsing linker errors', function(){
	let stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/6_linker.txt');
	});
	it('should return an object', function(){
		const output = parser.parseString(stdout);
		let i = 3;
		expect(output.length).to.equal(17);
		expect(output[i].type).to.equal('error');
		expect(output[i].subtype).to.equal('undefined reference');
		expect(output[i].filename).to.equal('/workspace/dispatcher.cpp');
		expect(output[i].line).to.equal(27);
		expect(output[i].column).to.equal(0);
		expect(output[i].text).to.equal('undefined reference to "vtable for Logger"');
		expect(output[i].affectedSymbol).to.equal('vtable for Logger');
		expect(output[i].parentFunction).to.equal('Dispatcher::setLog(Logger*)');

		i += 3;
		expect(output[i].subtype).to.equal('multiple definition');
		expect(output[i].parentFunction).to.equal('IntervalTimer::isAllocated_SIT()');
		expect(output[i].firstDefined.filename).to.equal('SparkIntervalTimer.cpp');
		expect(output[i].firstDefined.line).to.equal(61);
	});
});

describe('parsing 0.6.0 errors', function(){
	let stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/8_dray_0.6.0.txt');
	});
	it('should return an object', function(){
		const output = parser.parseString(stdout);

		expect(output.length).to.equal(7);
		expect(output[5].type).to.equal('error');
		expect(output[5].filename).to.equal('emptyerror.ino');
		expect(output[5].line).to.equal(23);
		expect(output[5].column).to.equal(34);
		expect(output[5].text).to.equal('\'count\' was not declared in this scope');
		expect(output[6].type).to.equal('error');
		expect(output[6].filename).to.equal('emptyerror.ino');
		expect(output[6].line).to.equal(27);
		expect(output[6].column).to.equal(5);
		expect(output[6].text).to.equal('\'count\' was not declared in this scope');
	});
});

describe('parsing gcc 9.2 errors', function(){
	let stdout = null;
	before(function(){
		stdout = fs.readFileSync(__dirname + '/9_gcc_9.2.txt');
	});
	it('should return an object', function(){
		const output = parser.parseString(stdout);

		expect(output.length).to.equal(14);
		expect(output[11].type).to.equal('error');
		expect(output[11].filename).to.equal('201204_fc_recv_1.ino');
		expect(output[11].line).to.equal(583);
		expect(output[11].column).to.equal(5);
		expect(output[11].text).to.equal(`expected declaration before '}' token`);
	});
});
