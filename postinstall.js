const fs = require('fs');
const path = require('path');

const mapsPath = path.join(
  __dirname,
  'node_modules',
  'react-native-maps',
  'lib',
  'index.web.js'
);

fs.writeFileSync(mapsPath, 'export default {};', 'utf8');
