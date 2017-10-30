import * as path from 'path';
import * as findUp from 'find-up';

export default async function findBaseDir() {
  const filePath = await findUp('.paperist');
  if (!filePath) {
    throw new Error('`.paperist` folder is not found. Please initialize first.');
  }
  return path.dirname(filePath);
}
