const fs = require('fs/promises');
const path = require('path');
const SimpleDB = require('../lib/simple-DB.js');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('gets by id', async () => {
    const firstDb = new SimpleDB(TEST_DIR);
    const newFile = {
      id: '1',
      content: 'new file',
    };
    const filePath = path.join(TEST_DIR, `${newFile.id}.txt`);
    await fs.writeFile(filePath, JSON.stringify(newFile));
    expect(await firstDb.get(newFile.id)).toEqual(newFile);
  });
});
