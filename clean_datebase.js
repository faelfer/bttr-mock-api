const database = require('./database.json');
const writeDatabase = require('./utils/writeDatabase');
const usersDefault = require('./resources/default_users.json');
const notificationsDefault = require('./resources/default_notification.json');
const areasDefault = require('./resources/default_areas.json');
const rolesDefault = require('./resources/default_roles.json');
const indicatorsDefault = require('./resources/default_indicators.json');
const actionsDefault = require('./resources/default_actions.json');

try {
  const manipuleDatabase = database;

  manipuleDatabase.users = usersDefault;
  manipuleDatabase.notifications = notificationsDefault;
  manipuleDatabase.areas = areasDefault;
  manipuleDatabase.roles = rolesDefault;
  manipuleDatabase.meetings = [];
  manipuleDatabase.pendencies = [];
  manipuleDatabase.indicators = indicatorsDefault;
  manipuleDatabase.actions = actionsDefault;
  manipuleDatabase.records = [];
  manipuleDatabase.decisions = [];
  writeDatabase(manipuleDatabase);
  console.log('clean_datebase | sucess');
} catch (error) {
  console.log('clean_datebase | error: ', error);
}
