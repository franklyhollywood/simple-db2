const { writeFile, readFile, readdir } = require('fs/promises');
const path = require('path');
const shortid = require('shortid');
class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  async get(id) {
    try {
      const fileName = `${id}.json`;
      this.file = path.join(this.dirPath, fileName);
      const parsedFile = await readFile(this.file, 'utf-8');
      return JSON.parse(parsedFile);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return new Error('Not Found');
      }
      throw error;
    }
  }
  //save(newObject)
  save(newObject) {
    try {
      const newId = shortid.generate();
      newObject.id = newId;
      const newFile = `${newId}.json`;
      this.newFolder = path.join(this.dirPath, newFile);
      const stringObj = JSON.stringify(newObject);
      return writeFile(this.newFolder, stringObj);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return new Error('Not Found');
      }
      throw error;
    }
  }

  async getAll() {
    const allFiles = await readdir(this.dirPath);
    return Promise.all(allFiles.map((file) => this.get(file.split('.')[0])));
  }
}

module.exports = SimpleDb;
