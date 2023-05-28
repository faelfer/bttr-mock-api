const database = require('./database.json');
const writeDatabase = require('./src/utils/writeDatabase');
const usersDefault = require('./src/resources/default_users.json');
const skillsDefault = require('./src/resources/default_skills.json');
const timesDefault = require('./src/resources/default_times.json');

try {
  const manipuleDatabase = database;

  manipuleDatabase.users = usersDefault;
  manipuleDatabase.skills = skillsDefault;
  manipuleDatabase.times = timesDefault;
  writeDatabase(manipuleDatabase);
  console.log('clean_datebase | sucess');
} catch (error) {
  console.log('clean_datebase | error: ', error);
}
