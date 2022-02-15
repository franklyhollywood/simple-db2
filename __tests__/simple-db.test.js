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

  it('checks for ENOENT in the implemenation, to check it returns a not found error', async () => {
    const firstDb = new SimpleDB(TEST_DIR);

    const newObject = {
      name: 'test name',
      text: 'I do not follow',
      id: '1',
    };
    fs.writeFile(TEST_DIR + '/' + 1 + '.txt', JSON.stringify(newObject));

    const result = await firstDb.get(1);
    expect(result.message).toEqual('Not Found');
  });

  it('Takes an object, assigns a random id (sets an id property) and the serializes (JSON.stringify) the object into a file of name [id].json.', async () => {
    const firstDb = new SimpleDB(TEST_DIR);
    const newObject = {
      name: 'test name',
      text: 'I do not follow',
    };
    return firstDb
      .save(newObject)
      .then(() => expect(newObject.id).toEqual(expect.any(String)));
  });

  it('Get all the objects in the directory', async () => {
    const firstDb = new SimpleDB(TEST_DIR);
    const newObject1 = {
      name: 'test name',
      text: 'I do not follow',
    };
    const newObject2 = {
      name: 'I love you',
      text: 'Eat things',
    };
    await firstDb.save(newObject1);
    await firstDb.save(newObject2);

    const allObjects = await firstDb.getAll();

    expect(allObjects).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: 'test name',
          text: 'I do not follow',
        },
        {
          id: expect.any(String),
          name: 'I love you',
          text: 'Eat things',
        },
      ])
    );
  });
});
