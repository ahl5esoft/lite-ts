# template-url
Super simple no fluff rest URL style formatting for node.

## Installation

    > npm install template-url --save

## Usage

```javascript
var templateUrl = require('template-url');

var url = templateUrl('https://api.github.com/repos/:owner/:repo', { owner : 'saintedlama', repo: 'template-url' }); 

// Generates https://api.github.com/repos/saintedlama/template-url
```

Be aware that this module **throws** errors in case a part of the template URL cannot be resolved.

## The End
This is a 27 lines module. Nothing more to say
