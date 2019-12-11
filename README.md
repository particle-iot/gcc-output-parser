# gcc output parser library

[![Build Status](https://travis-ci.org/wokwi/gcc-output-parser.svg?branch=master)](https://travis-ci.org/wokwi/gcc-output-parser)

Library which helps annotate/highlight `gcc` output.

## Installation

```shell
$ npm install @wokwi/gcc-output-parser
```

## Usage

```javascript
var parser = require('@wokwi/gcc-output-parser');

console.log(parser.parseString(gccOutput));
```

example output:

```javascript
[ { filename: '/sketch/sketch.ino',
    line: 6,
    column: 3,
    type: 'error',
    text: "'digitalWire' was not declared in this scope",
    codeWhitespace: '   ',
    code: 'digitalWire(LED_BUILTIN, HIGH);',
    adjustedColumn: 0,
    startIndex: 47,
    endIndex: 162,
    parentFunction: 'void loop()'
} ]
```
