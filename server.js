/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const jsonServer = require('json-server');
const path = require('path');
const multer = require('multer');

const userController = require('./src/controllers/user');
const skillController = require('./src/controllers/skill');
const timeController = require('./src/controllers/time');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage });

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'database.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.post('/users/sign_up', userController.signUp);
server.post('/users/forgot_password', userController.forgotPassword);
server.post('/users/sign_in', userController.signIn);
server.get('/users/profile', userController.profile);
server.patch('/users/profile', userController.profileUpdate);
server.delete('/users/profile', userController.userDelete);
server.post('/users/redefine_password', userController.redefinePassword);

server.post('/skills/create_skill', skillController.createSkill);
server.put('/skills/update_skill_by_id/:skill_id', skillController.updateByIdSkill);
server.get('/skills/skills_from_user', skillController.skillsFromUser);
server.get('/skills/skills_by_page', skillController.skillsByPage);
server.delete('/skills/delete_skill_by_id/:skill_id', skillController.deleteByIdSkill);
server.get('/skills/skill_by_id/:skill_id', skillController.skillById);

server.post('/times/create_time', timeController.createTime);
server.get('/times/times_by_page', timeController.timesByPage);
server.get('/times/time_by_id/:time_id', timeController.timeById);
server.put('/times/update_time_by_id/:time_id', timeController.updateByIdTime);
server.delete('/times/delete_time_by_id/:time_id', timeController.deleteByIdTime);
server.get('/times/times_by_date', timeController.timesByDate);

server.get('/debug-sentry', () => {
  throw new Error('Checking Sentry Integration!');
});

server.get('/test', async (req, res) => {
  res.json({ message: 'pass!' });
});

server.get('/file/:name', (req, res, next) => {
  const options = {
    root: path.join(__dirname, 'public/uploads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };

  const fileName = req.params.name;
  res.sendFile(fileName, options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

server.use(upload.any());
// Use default router
server.use(router);
server.listen(8000, () => {
  console.log('JSON Server is running...');
});
