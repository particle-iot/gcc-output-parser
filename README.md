# gcc output parser library

[![Build Status](https://travis-ci.org/wokwi/gcc-output-parser.svg?branch=master)](https://travis-ci.org/wokwi/gcc-output-parser)

Library which helps annotate/highlight `gcc` output.

## Installation

```shell
$ npm install gcc-output-parser
```

## Usage

```javascript
var parser = require('gcc-output-parser');

console.log(parser.parseString(gccOutput));
```

example output:

```javascript
[ { filename: 'HolidayButton.cpp',
    line: 4,
    column: 37,
    type: 'fatal error',
    text: 'ParticleButton/ParticleButton.h: No such file or directory',
    codeWhitespace: ' ',
    code: 'void onCheer(const char *topic, const char *data);',
    adjustedColumn: 36 } ]
```
