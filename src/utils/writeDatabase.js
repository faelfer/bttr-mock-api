const fs = require('fs');

module.exports = function writeDatabase(databaseUpdated) {
  try {
    const databaseUpdatedString = JSON.stringify(databaseUpdated);
    fs.writeFile(
      './database.json',
      databaseUpdatedString,
      (error) => console.log('fs.writeFile | error: ', error),
    );
  } catch (error) {
    console.log('writeDatabase | error: ', error);
  }
};
