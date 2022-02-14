const { writeFile, readFile, readdir } = require('fs/promises');
const path = require('path');
const shortid = require('shortid');
class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  get(id) {
    const fileName = `${id}.txt`;
    this.file = path.join(this.dirPath, fileName);
    const parsedFile = readFile(this.file, 'utf-8').then((file) =>
      JSON.parse(file)
    );

    return parsedFile.catch((error) => {
      if (error.code === 'ENOENT') {
        return new Error('Not Found');
      }
      throw error;
    });
  }
  //save(newObject)
  save(newObject) {
    const newId = shortid.generate();
    newObject.id = newId;
    const newFile = `${newId}.json`;
    this.newFolder = path.join(this.dirPath, newFile);
    const stringObj = JSON.stringify(newObject);
    return writeFile(this.newFolder, stringObj);
  }
}

module.exports = SimpleDb;
