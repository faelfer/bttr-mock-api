/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { faker } = require('@faker-js/faker');

const database = require('../../database.json');
const auth = require('../utils/auth');
const writeDatabase = require('../utils/writeDatabase');
const { queryItem } = require('../utils/ORMDatabase');

module.exports = {
  async skillCreate(req, res) {
    try {
      const { body, rawHeaders } = req;

      // console.log('skillCreate | rawHeaders: ', rawHeaders);
      // console.log('skillCreate | body: ', body);
      // console.log('skillCreate | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);
      // console.log('skillCreate | tokenFound: ', tokenFound);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('skillCreate | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const newSkill = body;
        const newSkillId = faker.random.numeric(9);
        const newSkillIdNumber = parseInt(newSkillId, 10);
        newSkill.id = newSkillIdNumber;
        newSkill.name = body.name;
        newSkill.time_daily = body.time_daily;
        newSkill.time_total = 0;
        newSkill.created = new Date();
        // console.log('skillCreate | newSkill: ', newSkill);
        const manipuleDatabase = database;
        manipuleDatabase.skills = [...manipuleDatabase.skills, newSkill];
        // console.log('skillCreate | manipuleDatabase.skills: ', manipuleDatabase.skills);
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'tempo foi criado com sucesso.',
        });
      }
    } catch (error) {
      console.log('skillCreate | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

//   async timeUpdate(req, res) {
//     try {
//       const { body, rawHeaders } = req;

//       // console.log('timeUpdate | rawHeaders: ', rawHeaders);
//       // console.log('timeUpdate | body: ', body);
//       // console.log('timeUpdate | database.users: ', database.users);

//       const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

//       const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
//       console.log('timeUpdate | userFound: ', userFound);

//       const timeFound = (database.times).find((timeCycle) => queryItem(
//         timeCycle,
//         'id',
//         parseInt(body.time_id, 10),
//       ));
//       console.log('timeUpdate | timeFound: ', timeFound);

//       if (userFound === undefined) {
//         res.status(401).jsonp({
//           message: 'token de autenticação inválida.',
//         });
//       } else if (timeFound === undefined) {
//         res.status(404).jsonp({
//           message: 'tempo não foi encontrada.',
//         });
//       } else {
//         const manipuleDatabase = database;
//         const indexFromMemberFound = (manipuleDatabase.times).indexOf(timeFound);
//         manipuleDatabase.times[indexFromMemberFound].name = body.name;
//         // console.log(
//         //   'timeUpdate | manipuleDatabase.times[indexFromMemberFound]: ',
//         //   manipuleDatabase.times[indexFromMemberFound],
//         // );

//         writeDatabase(manipuleDatabase);
//         res.jsonp({
//           message: 'tempo alterado com sucesso.',
//         });
//       }
//     } catch (error) {
//       console.log('timeUpdate | error.message: ', error.message);
//       res.status(500).jsonp({
//         error: error.message,
//       });
//     }
//   },

//   async timeDelete(req, res) {
//     try {
//       const { rawHeaders, body } = req;
//       // console.log('timeDelete | rawHeaders: ', rawHeaders);
//       // console.log('timeDelete | body: ', body);
//       // console.log('timeDelete | database.users: ', database.users);

//       const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

//       const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
//       // console.log('timeDelete | userFound: ', userFound);

//       const timeFound = (database.times).find((timeCycle) => queryItem(
//         timeCycle,
//         'id',
//         parseInt(body.time_id, 10),
//       ));
//       // console.log('timeById | timeFound: ', timeFound);

//       if (userFound === undefined) {
//         res.status(401).jsonp({
//           message: 'token de autenticação inválida',
//         });
//       } else if (timeFound === undefined) {
//         res.status(404).jsonp({
//           message: 'área não foi encontrada.',
//         });
//       } else {
//         const manipuleDatabase = database;
//         const indexFromMemberFound = (manipuleDatabase.times).indexOf(timeFound);
//         (manipuleDatabase.times).splice(indexFromMemberFound, 1);
//         // console.log('timeDelete | manipuleDatabase.times: ', manipuleDatabase.times);
//         writeDatabase(manipuleDatabase);
//         res.jsonp({
//           message: 'tempo excluido com sucesso.',
//         });
//       }
//     } catch (error) {
//       console.log('timeDelete | error.message: ', error.message);
//       res.status(500).jsonp({
//         error: error.message,
//       });
//     }
//   },

//   async abiliityList(req, res) {
//     try {
//       const { page } = req.query;

//       if (page) {
//         const abiliity = await Abiliity.paginate(
//           {
//             user: req.userId,
//           },
//           {
//             page,
//             limit: 6,
//             select: '-user',
//             sort: { timeTotal: 'desc' },
//           },
//         );

//         if (!abiliity) {
//           return res.status(400).send({ message: 'abiliity does not exist' });
//         }

//         return res.json(abiliity);
//       }
//       const abiliity = await Abiliity.find({ user: req.userId });

//       if (!abiliity) {
//         return res.status(400).send({ message: 'abiliity does not exist' });
//       }

//       return res.json(abiliity);
//     } catch (error) {
//       console.log('abiliityList | error: ', error);
//       res.status(500).send(error);
//     }
//   },

//   async abiliityDetail(req, res) {
//     try {
//       console.log('abiliityDetail | req.userId: ', req.userId);
//       console.log('abiliityDetail | req.params.id: ', req.params.id);

//       const abiliity = await Abiliity.find({
//         user: req.userId,
//         _id: req.params.id,
//       }).select('-user');

//       if (!abiliity) {
//         return res.status(400).send({ message: 'abiliity or user does not exist' });
//       }

//       return res.json(abiliity);
//     } catch (error) {
//       console.log('abiliityDetail | error: ', error);
//       res.status(500).send(error);
//     }
//   },

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
