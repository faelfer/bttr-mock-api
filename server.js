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

server.post('/api/users/sign_up', userController.signUp);
server.post('/api/users/forgot_password', userController.forgotPassword);
server.post('/api/users/sign_in', userController.signIn);
server.get('/api/users/profile', userController.profile);
server.patch('/api/users/profile', userController.profileUpdate);
server.delete('/api/users/profile', userController.userDelete);
server.post('/api/users/redefine_password', userController.redefinePassword);

server.post('/api/skills/create_skill', skillController.createSkill);
server.put('/api/skills/update_skill_by_id/:skill_id', skillController.updateByIdSkill);
server.get('/api/skills/skills_from_user', skillController.skillsFromUser);
server.get('/api/skills/skills_by_page', skillController.skillsByPage);
server.delete('/api/skills/delete_skill_by_id/:skill_id', skillController.deleteByIdSkill);
server.get('/api/skills/skill_by_id/:skill_id', skillController.skillById);

server.post('/api/times/create_time', timeController.createTime);
server.get('/api/times/times_by_page', timeController.timesByPage);
server.get('/api/times/time_by_id/:time_id', timeController.timeById);
server.put('/api/times/update_time_by_id/:time_id', timeController.updateByIdTime);
server.delete('/api/times/delete_time_by_id/:time_id', timeController.deleteByIdTime);
server.get('/api/times/times_by_date', timeController.timesByDate);

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
