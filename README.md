# gcc output parser library

[![Build Status](https://circleci.com/gh/particle-iot/gcc-output-parser.svg?style=shield)](https://app.circleci.com/pipelines/github/particle-iot/gcc-output-parser)

Library which helps annotate/highlight `gcc` output.

[Installation](#installation) | [Usage](#usage)  |  [Releasing](#releasing)

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

## Releasing

See the release process in the [RELEASE.md](RELEASE.md) file.
