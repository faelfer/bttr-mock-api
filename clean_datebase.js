const database = require('./database.json');
const writeDatabase = require('./src/utils/writeDatabase');
const usersDefault = require('./src/resources/default_users.json');

try {
  const manipuleDatabase = database;

  manipuleDatabase.users = usersDefault;
  writeDatabase(manipuleDatabase);
  console.log('clean_datebase | sucess');
} catch (error) {
  console.log('clean_datebase | error: ', error);
}
