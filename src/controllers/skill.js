/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { faker } = require('@faker-js/faker');

const database = require('../../database.json');
const auth = require('../utils/auth');
const writeDatabase = require('../utils/writeDatabase');
const itemsByDateOrder = require('../utils/itemsByDateOrder');
const { queryItem } = require('../utils/ORMDatabase');

module.exports = {
  async skillsByPage(req, res) {
    try {
      const { query, route, rawHeaders } = req;
      // console.log('skillsByPage | route.path: ', route.path);
      // console.log('skillsByPage | query: ', query);
      // console.log('skillsByPage | db.users: ', db.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);
      // console.log('createSkil | tokenFound: ', tokenFound);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('createSkil | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const skillsFromUser = (database.skills).filter(
          (skillLoop) => auth.filterItemsFromUser(skillLoop, userFound.id),
        );

        const skillsOrderByDate = itemsByDateOrder(skillsFromUser, 'created');

        const amountItensByPage = 5;
        const currentPage = parseInt(query.page, 10);

        const numberTotalPages = Math.ceil((skillsOrderByDate.length) / amountItensByPage);

        const indexSliceFinal = (currentPage * amountItensByPage);
        const indexSliceInitial = indexSliceFinal - amountItensByPage;

        const skillsFromPage = skillsOrderByDate.slice(indexSliceInitial, indexSliceFinal);

        const nextPage = currentPage + 1;
        const previousPage = currentPage - 1;
        // console.log(
        //   'skillsByPage | numberTotalPages, nextPage, previousPage: ',
        //   numberTotalPages,
        //   nextPage,
        //   previousPage,
        // );

        const response = {
          count: skillsOrderByDate.length,
          next: nextPage <= numberTotalPages ? `http://localhost:8000${route.path}?page=${nextPage}` : null,
          previous: previousPage > 0 ? `http://localhost:8000${route.path}?page=${previousPage}` : null,
          results: skillsFromPage,
        };
        // console.log('skillsByPage | response: ', response);
        res.jsonp(response);
      }
    } catch (error) {
      console.log('skillsByPage | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async skillById(req, res) {
    try {
      const { params, rawHeaders } = req;
      console.log('skillById | params: ', params);
      console.log('skillById | rawHeaders: ', rawHeaders);
      // console.log('skillById | db.users: ', db.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      console.log('skillById | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida.',
        });
      } else {
        const skillsFromUser = (database.skills).filter(
          (skillLoop) => auth.filterItemsFromUser(skillLoop, userFound.id),
        );
        console.log('skillById | skillsFromUser: ', skillsFromUser);

        const skillFound = skillsFromUser.find((skillCycle) => queryItem(
          skillCycle,
          'id',
          parseInt(params.skill_id, 10),
        ));
        console.log('skillById | skillFound: ', skillFound);

        if (skillFound === undefined) {
          res.status(404).jsonp({
            message: 'habilidade não foi encontrada.',
          });
        } else {
          res.jsonp({
            skill: skillFound,
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

  async createSkil(req, res) {
    try {
      const { body, rawHeaders } = req;

      // console.log('createSkil | rawHeaders: ', rawHeaders);
      // console.log('createSkil | body: ', body);
      // console.log('createSkil | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);
      // console.log('createSkil | tokenFound: ', tokenFound);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('createSkil | userFound: ', userFound);

      const skillNameFound = (database.skills).find((skillCycle) => queryItem(
        skillCycle,
        'name',
        body.name,
      ));

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else if (skillNameFound !== undefined) {
        res.status(409).jsonp({
          message: 'nome de habilidade já existente.',
        });
      } else {
        const newSkill = body;
        const newSkillId = faker.random.numeric(9);
        const newSkillIdNumber = parseInt(newSkillId, 10);
        newSkill.id = newSkillIdNumber;
        newSkill.name = body.name;
        newSkill.time_daily = body.time_daily;
        newSkill.time_total = 0;
        newSkill.user = userFound;
        newSkill.created = new Date();
        // console.log('createSkil | newSkill: ', newSkill);
        const manipuleDatabase = database;
        manipuleDatabase.skills = [...manipuleDatabase.skills, newSkill];
        // console.log('createSkil | manipuleDatabase.skills: ', manipuleDatabase.skills);
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'habilitade foi criada com sucesso.',
        });
      }
    } catch (error) {
      console.log('createSkil | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async updateByIdSkill(req, res) {
    try {
      const { rawHeaders, params, body } = req;

      // console.log('updateByIdSkill | params: ', params);
      // console.log('updateByIdSkill | rawHeaders: ', rawHeaders);
      // console.log('updateByIdSkill | body: ', body);
      // console.log('updateByIdSkill | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      console.log('updateByIdSkill | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida.',
        });
      } else {
        const skillsFromUser = (database.skills).filter(
          (skillLoop) => auth.filterItemsFromUser(skillLoop, userFound.id),
        );
        console.log('updateByIdSkill | skillsFromUser: ', skillsFromUser);

        const skillFound = skillsFromUser.find((skillCycle) => queryItem(
          skillCycle,
          'id',
          parseInt(params.skill_id, 10),
        ));
        console.log('updateByIdSkill | skillFound: ', skillFound);

        if (skillFound === undefined) {
          res.status(404).jsonp({
            message: 'habilidade não foi encontrada.',
          });
        } else {
          const manipuleDatabase = database;
          const indexFromSkillFound = (manipuleDatabase.skills).indexOf(skillFound);
          manipuleDatabase.skills[indexFromSkillFound].name = body.name;
          manipuleDatabase.skills[indexFromSkillFound].time_daily = body.time_daily;
          manipuleDatabase.skills[indexFromSkillFound].time_total = body.time_total;
          // console.log(
          //   'updateByIdSkill | manipuleDatabase.skills[indexFromSkillFound]: ',
          //   manipuleDatabase.skills[indexFromSkillFound],
          // );

          writeDatabase(manipuleDatabase);
          res.jsonp({
            message: 'habilidade alterada com sucesso.',
          });
        }
      }
    } catch (error) {
      console.log('updateByIdSkill | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async deleteByIdSkill(req, res) {
    try {
      const { rawHeaders, params } = req;
      // console.log('deleteByIdSkill | rawHeaders: ', rawHeaders);
      // console.log('deleteByIdSkill | body: ', body);
      // console.log('deleteByIdSkill | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('deleteByIdSkill | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const skillsFromUser = (database.skills).filter(
          (skillLoop) => auth.filterItemsFromUser(skillLoop, userFound.id),
        );
        console.log('deleteByIdSkill | skillsFromUser: ', skillsFromUser);

        const skillFound = skillsFromUser.find((timeCycle) => queryItem(
          timeCycle,
          'id',
          parseInt(params.skill_id, 10),
        ));
        // console.log('deleteByIdSkill | skillFound: ', skillFound);

        if (skillFound === undefined) {
          res.status(404).jsonp({
            message: 'habilidade não foi encontrada.',
          });
        } else {
          const manipuleDatabase = database;
          const indexFromSkillFound = (manipuleDatabase.skills).indexOf(skillFound);
          (manipuleDatabase.skills).splice(indexFromSkillFound, 1);
          // console.log('deleteByIdSkill | manipuleDatabase.skills: ', manipuleDatabase.skills);
          writeDatabase(manipuleDatabase);
          res.jsonp({
            message: 'habilidade excluida com sucesso.',
          });
        }
      }
    } catch (error) {
      console.log('deleteByIdSkill | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

//   async abiliityAddMinutes(req, res) {
//     try {
//       console.log('abiliityAddMinutes | req.userId: ', req.userId);
//       console.log('abiliityAddMinutes | req.params.id: ', req.params.id);
//       console.log('abiliityAddMinutes | req.body.minutes: ', req.body.minutes, typeof req.body.minutes);

//       const abiliity = await Abiliity.findOne({
//         user: req.userId,
//         _id: req.params.id,
//       });

//       if (!abiliity) {
//         return res.status(400).send({ message: 'abiliity or user does not exist' });
//       }
//       console.log('abiliityAddMinutes | abiliity: ', abiliity);
//       console.log('abiliityAddMinutes | abiliity.timeTotal: ', abiliity.timeTotal, typeof abiliity.timeTotal);

//       abiliity.timeTotal += req.body.minutes;

//       console.log('abiliityAddMinutes | abiliity.timeTotal: ', abiliity);
//       const abiliityNew = await Abiliity.findByIdAndUpdate(
//         abiliity._id,
//         { timeTotal: abiliity.timeTotal },
//         { new: true },
//       );

//       console.log('abiliityAddMinutes | abiliityNew: ', abiliityNew);

//       const time = await Time.create({
//         minutes: req.body.minutes,
//         abiliity: abiliity._id,
//         user: abiliity.user,
//       });
//       console.log('abiliityAddMinutes | time: ', time);

//       return res.json({ message: 'minutes successfully added to abiliity' });
//     } catch (error) {
//       console.log('abiliityAddMinutes | error: ', error);
//       res.status(500).send(error);
//     }
//   },
};
