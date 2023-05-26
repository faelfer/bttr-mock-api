/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const jsonServer = require('json-server');
const path = require('path');
const multer = require('multer');

const userController = require('./src/controllers/user');
const skillController = require('./src/controllers/skill');
// const timeController = require('./src/controllers/time');

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

server.post("/users/sign_up", userController.signUp);
server.post("/users/forgot_password", userController.forgotPassword);
server.post("/users/sign_in", userController.signIn);
server.get("/users/profile", userController.profile);
server.patch("/users/profile", userController.profileUpdate);
server.delete("/users/profile", userController.userDelete);
server.post("/users/redefine_password", userController.redefinePassword);

server.post("/skills/create_skill", skillController.skillCreate);
// server.get("/abiliity/:id", skillController.abiliityDetail);
// server.post("/abiliity", skillController.abiliityCreate);
// server.put("/abiliity/:id", skillController.abiliityUpdate);
// server.put("/abiliity/:id/add_minutes", skillController.abiliityAddMinutes);
// server.delete("/abiliity/:id", skillController.abiliityDelete);

// server.get("/time", timeController.timeList);
// server.get("/time/:id", timeController.timeDetail);
// server.get("/time/filter_by_abiliity/:id", timeController.timeFilterByAbiliity);
// server.post("/time", timeController.timeCreate);
// server.put("/time/:id", timeController.timeUpdate);
// server.delete("/time/:id", timeController.timeDelete);
// server.get("/time/filter_by_abiliity_and_date/:id", timeController.timeFilterByAbiliityAndDate);

server.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error('Checking Sentry Integration!');
});

server.get('/test', async (req, res) => {
    res.json({message: 'pass!'})
})

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
