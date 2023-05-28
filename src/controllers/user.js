/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { faker } = require('@faker-js/faker');

const database = require('../../database.json');
const auth = require('../utils/auth');
const writeDatabase = require('../utils/writeDatabase');
const { queryItem } = require('../utils/ORMDatabase');

module.exports = {
  async signUp(req, res) {
    try {
      const { body } = req;

      console.log('signUp | body: ', body);
      // console.log('signUp | database.users: ', database.users);

      const emailFound = (database.users).find((userLoop) => queryItem(
        userLoop,
        'email',
        body.email,
      ));
      // console.log('signUp | emailFound: ', emailFound);

      const usernameFound = (database.users).find((userCycle) => queryItem(
        userCycle,
        'username',
        body.username,
      ));
      // console.log('signUp | usernameFound: ', usernameFound);

      if (emailFound !== undefined) {
        res.status(409).jsonp({
          message: 'usuário com e-mail já existente.',
        });
      } else if (usernameFound !== undefined) {
        res.status(409).jsonp({
          message: 'nome de usuário já existente.',
        });
      } else {
        const newUserId = faker.random.numeric(9);
        const newUserIdNumber = parseInt(newUserId, 10);
        const newUser = {
          id: newUserIdNumber,
          token: `Token ${faker.datatype.uuid()}`,
          username: body.username,
          email: body.email,
          password: body.password,
          created: new Date(),
        };
        // console.log('signUp | newUser: ', newUser);
        const manipuleDatabase = database;
        manipuleDatabase.users = [...manipuleDatabase.users, newUser];
        // console.log('signUp | manipuleDatabase.users: ', manipuleDatabase.users);
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'usuário foi criado com sucesso.',
        });
      }
    } catch (error) {
      console.log('signUp | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async signIn(req, res) {
    try {
      const { body } = req;
      // console.log('signIn | body: ', body);
      // console.log('signIn | database.users: ', database.users);

      const userFound = (database.users).find((user) => queryItem(
        user,
        'email',
        body.email,
      ));
      // console.log('signIn | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(404).jsonp({
          message: 'usuário não foi encontrado.',
        });
      } else if (userFound.password !== body.password) {
        // console.log('signIn | body.password: ', body.password);
        // console.log('signIn | userFound.password: ', userFound.password);
        res.status(401).jsonp({
          message: 'senha incorreta.',
        });
      } else {
        res.jsonp({
          token: (userFound.token).replace('Token ', ''),
          user: userFound,
          message: 'autenticação realizada com sucesso.',
        });
      }
    } catch (error) {
      console.log('signIn | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { body } = req;
      // console.log('forgotPassword | body: ', body);
      // console.log('forgotPassword | database.users: ', database.users);

      const userFound = (database.users).find((user) => queryItem(
        user,
        'email',
        body.email,
      ));
      // console.log('forgotPassword | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(404).jsonp({
          message: 'usuário não foi encontrado.',
        });
      } else {
        const passwordTemporary = faker.random.alphaNumeric(8);

        const manipuleDatabase = database;
        // console.log('forgotPassword | manipuleDatabase.users: ', manipuleDatabase.users);
        const indexFromUserFound = (manipuleDatabase.users).indexOf(userFound);
        // console.log('forgotPassword | indexFromUserFound: ', indexFromUserFound);
        manipuleDatabase.users[indexFromUserFound].password = passwordTemporary;
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'senha temporária enviada',
        });
      }
    } catch (error) {
      console.log('forgotPassword | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async profile(req, res) {
    try {
      const { rawHeaders } = req;
      // console.log('profile | rawHeaders: ', rawHeaders);
      // console.log('profile | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('profile | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        res.jsonp({
          user: userFound,
        });
      }
    } catch (error) {
      console.log('profile | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async profileUpdate(req, res) {
    try {
      const { body, rawHeaders } = req;

      // console.log('profileUpdate | rawHeaders: ', rawHeaders);
      // console.log('profileUpdate | body: ', body);
      // console.log('profileUpdate | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);
      // console.log('profileUpdate | tokenFound: ', tokenFound);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('profileUpdate | userFound: ', userFound);

      const emailFound = (database.users).find((user) => queryItem(
        user,
        'email',
        body.email,
      ));
      // console.log('profileUpdate | emailFound: ', emailFound);

      const usernameFound = (database.users).find((user) => queryItem(
        user,
        'username',
        body.username,
      ));
      // console.log('signUp | usernameFound: ', usernameFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida.',
        });
      } else if (emailFound !== undefined && userFound.id !== emailFound.id) {
        res.status(409).jsonp({
          message: 'usuário com e-mail já existente.',
        });
      } else if (usernameFound !== undefined && userFound.id !== usernameFound.id) {
        res.status(409).jsonp({
          message: 'nome de usuário já existente.',
        });
      } else {
        const manipuleDatabase = database;
        const indexFromUserFound = (manipuleDatabase.users).indexOf(userFound);
        manipuleDatabase.users[indexFromUserFound].username = body.username;
        manipuleDatabase.users[indexFromUserFound].email = body.email;
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'perfil alterado com sucesso.',
        });
      }
    } catch (error) {
      console.log('profileUpdate | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async redefinePassword(req, res) {
    try {
      const { rawHeaders, body } = req;
      // console.log('redefinePassword | rawHeaders: ', rawHeaders);
      // console.log('redefinePassword | body: ', body);
      // console.log('redefinePassword | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('redefinePassword | userFound: ', userFound);
      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else if (userFound.password !== body.password) {
        res.status(401).jsonp({
          message: 'senha preenchida é incorreta.',
        });
      } else {
        const manipuleDatabase = database;
        const indexFromUserFound = (manipuleDatabase.users).indexOf(userFound);
        manipuleDatabase.users[indexFromUserFound].password = body.new_password;
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'senha alterada com sucesso.',
        });
      }
    } catch (error) {
      console.log('redefinePassword | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async userDelete(req, res) {
    try {
      const { rawHeaders } = req;
      // console.log('userDelete | rawHeaders: ', rawHeaders);
      // console.log('userDelete | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('userDelete | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const manipuleDatabase = database;
        const indexFromUserFound = (manipuleDatabase.users).indexOf(userFound);
        (manipuleDatabase.users).splice(indexFromUserFound, 1);
        // console.log('userDelete | manipuleDatabase.users: ', manipuleDatabase.users);
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'usuário excluido com sucesso.',
        });
      }
    } catch (error) {
      console.log('userDelete | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },
};
