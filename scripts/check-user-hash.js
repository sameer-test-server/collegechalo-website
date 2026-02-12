const fs = require('fs');
const bcrypt = require('bcryptjs');

const content = fs.readFileSync('src/lib/users.ts', 'utf8');
const match = content.match(/email:\s*'test@example.com'[\s\S]*?password:\s*'([^']+)'/);
if (!match) {
  console.error('Could not find test user in src/lib/users.ts');
  process.exit(2);
}
const hash = match[1];
console.log('Extracted hash:', hash);
console.log('Compare with password123:', bcrypt.compareSync('password123', hash));
