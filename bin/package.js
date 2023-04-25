const fs = require('fs');

const package = JSON.parse(fs.readFileSync('./package.json'));

delete package.devDependencies;
delete package.scripts;

package.main = 'lib/es5/index.js';
package.module = 'lib/es6/index.js';
package.types = 'lib/es5/index.d.ts';
package.name = package.name.split('/')[1];

fs.writeFileSync('./dist/package.json', JSON.stringify(package, null, 2));