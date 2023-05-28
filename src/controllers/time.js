/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { faker } = require('@faker-js/faker');

const database = require('../../database.json');
const auth = require('../utils/auth');
const writeDatabase = require('../utils/writeDatabase');
const itemsByDateOrder = require('../utils/itemsByDateOrder');
const { queryItem } = require('../utils/ORMDatabase');

module.exports = {
  async timesByPage(req, res) {
    try {
      const { query, route, rawHeaders } = req;
      // console.log('timesByPage | route.path: ', route.path);
      // console.log('timesByPage | query: ', query);
      // console.log('timesByPage | db.users: ', db.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);
      // console.log('timesByPage | tokenFound: ', tokenFound);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('timesByPage | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const timesFromUser = (database.times).filter(
          (timeLoop) => auth.filterItemsFromUser(timeLoop, userFound.id),
        );

        const timesOrderByDate = itemsByDateOrder(timesFromUser, 'created');

        const amountItensByPage = 5;
        const currentPage = parseInt(query.page, 10);

        const numberTotalPages = Math.ceil((timesOrderByDate.length) / amountItensByPage);

        const indexSliceFinal = (currentPage * amountItensByPage);
        const indexSliceInitial = indexSliceFinal - amountItensByPage;

        const timesFromPage = timesOrderByDate.slice(indexSliceInitial, indexSliceFinal);

        const nextPage = currentPage + 1;
        const previousPage = currentPage - 1;
        // console.log(
        //   'timesByPage | numberTotalPages, nextPage, previousPage: ',
        //   numberTotalPages,
        //   nextPage,
        //   previousPage,
        // );

        const response = {
          count: timesOrderByDate.length,
          next: nextPage <= numberTotalPages ? `http://localhost:8000${route.path}?page=${nextPage}` : null,
          previous: previousPage > 0 ? `http://localhost:8000${route.path}?page=${previousPage}` : null,
          results: timesFromPage,
        };
        // console.log('timesByPage | response: ', response);
        res.jsonp(response);
      }
    } catch (error) {
      console.log('timesByPage | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async timeById(req, res) {
    try {
      const { params, rawHeaders } = req;
      console.log('timeById | params: ', params);
      console.log('timeById | rawHeaders: ', rawHeaders);
      // console.log('timeById | db.users: ', db.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      console.log('timeById | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida.',
        });
      } else {
        const timesFromUser = (database.times).filter(
          (timeLoop) => auth.filterItemsFromUser(timeLoop, userFound.id),
        );
        console.log('timeById | timesFromUser: ', timesFromUser);

        const timeFound = timesFromUser.find((timeCycle) => queryItem(
          timeCycle,
          'id',
          parseInt(params.time_id, 10),
        ));
        console.log('timeById | timeFound: ', timeFound);

        if (timeFound === undefined) {
          res.status(404).jsonp({
            message: 'tempo não foi encontrada.',
          });
        } else {
          res.jsonp({
            time: timeFound,
          });
        }
      }
    } catch (error) {
      console.log('skillById | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async createTime(req, res) {
    try {
      const { body, rawHeaders } = req;

      // console.log('createTime | rawHeaders: ', rawHeaders);
      // console.log('createTime | body: ', body);
      // console.log('createTime | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);
      // console.log('createTime | tokenFound: ', tokenFound);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('createTime | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const skillsFromUser = (database.skills).filter(
          (skillLoop) => auth.filterItemsFromUser(skillLoop, userFound.id),
        );
        // console.log('createTime | skillsFromUser: ', skillsFromUser);

        const skillFound = skillsFromUser.find((skillCycle) => queryItem(
          skillCycle,
          'id',
          parseInt(body.skill_id, 10),
        ));
        // console.log('createTime | skillFound: ', skillFound);

        if (skillFound === undefined) {
          res.status(404).jsonp({
            message: 'habilidade não foi encontrada.',
          });
        } else {
          const newTimeId = faker.random.numeric(9);
          const newTimeIdNumber = parseInt(newTimeId, 10);
          const newTime = {
            id: newTimeIdNumber,
            minutes: body.minutes,
            skill: skillFound,
            user: userFound,
            created: new Date(),
          };

          // console.log('createTime | newTime: ', newTime);
          const manipuleDatabase = database;
          manipuleDatabase.times = [...manipuleDatabase.times, newTime];
          // console.log('createTime | manipuleDatabase.skills: ', manipuleDatabase.skills);
          writeDatabase(manipuleDatabase);
          res.jsonp({
            message: 'tempo foi criado com sucesso.',
          });
        }
      }
    } catch (error) {
      console.log('createSkill | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async updateByIdTime(req, res) {
    try {
      const { rawHeaders, params, body } = req;

      // console.log('updateByIdTime | params: ', params);
      // console.log('updateByIdTime | rawHeaders: ', rawHeaders);
      // console.log('updateByIdTime | body: ', body);
      // console.log('updateByIdTime | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      console.log('updateByIdTime | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida.',
        });
      } else {
        const timesFromUser = (database.times).filter(
          (timeLoop) => auth.filterItemsFromUser(timeLoop, userFound.id),
        );
        console.log('updateByIdTime | timesFromUser: ', timesFromUser);

        const timeFound = timesFromUser.find((timeCycle) => queryItem(
          timeCycle,
          'id',
          parseInt(params.time_id, 10),
        ));
        console.log('updateByIdTime | timeFound: ', timeFound);

        if (timeFound === undefined) {
          res.status(404).jsonp({
            message: 'tempo não foi encontrado.',
          });
        } else {
          const skillsFromUser = (database.skills).filter(
            (skillLoop) => auth.filterItemsFromUser(skillLoop, userFound.id),
          );
          console.log('updateByIdTime | skillsFromUser: ', skillsFromUser);

          const skillFound = skillsFromUser.find((skillCycle) => queryItem(
            skillCycle,
            'id',
            parseInt(body.skill_id, 10),
          ));
          console.log('updateByIdTime | skillFound: ', skillFound);

          if (skillFound === undefined) {
            res.status(404).jsonp({
              message: 'habilidade não foi encontrada.',
            });
          } else {
            const manipuleDatabase = database;
            const indexFromSkillFound = (manipuleDatabase.times).indexOf(timeFound);
            manipuleDatabase.times[indexFromSkillFound].name = body.name;
            manipuleDatabase.times[indexFromSkillFound].skill = skillFound;
            // console.log(
            //   'updateByIdTime | manipuleDatabase.times[indexFromSkillFound]: ',
            //   manipuleDatabase.times[indexFromSkillFound],
            // );

            writeDatabase(manipuleDatabase);
            res.jsonp({
              message: 'tempo alterado com sucesso.',
            });
          }
        }
      }
    } catch (error) {
      console.log('updateByIdTime | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async deleteByIdTime(req, res) {
    try {
      const { rawHeaders, params } = req;
      // console.log('deleteByIdTime | rawHeaders: ', rawHeaders);
      // console.log('deleteByIdTime | body: ', body);
      // console.log('deleteByIdTime | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('deleteByIdTime | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const timesFromUser = (database.times).filter(
          (timeLoop) => auth.filterItemsFromUser(timeLoop, userFound.id),
        );
        console.log('deleteByIdTime | timesFromUser: ', timesFromUser);

        const timeFound = timesFromUser.find((timeCycle) => queryItem(
          timeCycle,
          'id',
          parseInt(params.time_id, 10),
        ));
        // console.log('deleteByIdTime | timeFound: ', timeFound);

        if (timeFound === undefined) {
          res.status(404).jsonp({
            message: 'tempo não foi encontrado.',
          });
        } else {
          const manipuleDatabase = database;
          const indexFromSkillFound = (manipuleDatabase.times).indexOf(timeFound);
          (manipuleDatabase.times).splice(indexFromSkillFound, 1);
          // console.log('deleteByIdTime | manipuleDatabase.times: ', manipuleDatabase.times);
          writeDatabase(manipuleDatabase);
          res.jsonp({
            message: 'tempo excluido com sucesso.',
          });
        }
      }
    } catch (error) {
      console.log('deleteByIdTime | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },
};
