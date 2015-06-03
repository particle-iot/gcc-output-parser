# gcc output parser library

![](https://travis-ci.org/spark/gcc-output-parser.svg)

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
    text: 'SparkButton/SparkButton.h: No such file or directory',
    codeWhitespace: ' ',
    code: 'void onCheer(const char *topic, const char *data);',
    adjustedColumn: 36 } ]
```
