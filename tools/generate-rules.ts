import fs from 'node:fs';

import { rules } from '../src/lib/services/firebase/rules';

const content = JSON.stringify(rules, null, 2);

fs.writeFile('tools/rules.json', content, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
});
