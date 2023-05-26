/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { faker } = require('@faker-js/faker');

const database = require('../../database.json');
const auth = require('../utils/auth');
const writeDatabase = require('../utils/writeDatabase');
const { queryItem } = require('../utils/ORMDatabase');

module.exports = {
  async timeCreate(req, res) {
    try {
      const { body, rawHeaders } = req;

      // console.log('timeCreate | rawHeaders: ', rawHeaders);
      // console.log('timeCreate | body: ', body);
      // console.log('timeCreate | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);
      // console.log('timeCreate | tokenFound: ', tokenFound);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('timeCreate | userFound: ', userFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else {
        const newTime = body;
        const newTimeId = faker.random.numeric(9);
        const newTimeIdNumber = parseInt(newTimeId, 10);
        newTime.id = newTimeIdNumber;
        newTime.created = new Date();
        // console.log('timeCreate | newTime: ', newTime);
        const manipuleDatabase = database;
        manipuleDatabase.times = [...manipuleDatabase.times, newTime];
        // console.log('timeCreate | manipuleDatabase.times: ', manipuleDatabase.times);
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'tempo foi criado com sucesso.',
        });
      }
    } catch (error) {
      console.log('timeCreate | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async timeUpdate(req, res) {
    try {
      const { body, rawHeaders } = req;

      // console.log('timeUpdate | rawHeaders: ', rawHeaders);
      // console.log('timeUpdate | body: ', body);
      // console.log('timeUpdate | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      console.log('timeUpdate | userFound: ', userFound);

      const timeFound = (database.times).find((timeCycle) => queryItem(
        timeCycle,
        'id',
        parseInt(body.time_id, 10),
      ));
      console.log('timeUpdate | timeFound: ', timeFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida.',
        });
      } else if (timeFound === undefined) {
        res.status(404).jsonp({
          message: 'tempo não foi encontrada.',
        });
      } else {
        const manipuleDatabase = database;
        const indexFromMemberFound = (manipuleDatabase.times).indexOf(timeFound);
        manipuleDatabase.times[indexFromMemberFound].name = body.name;
        // console.log(
        //   'timeUpdate | manipuleDatabase.times[indexFromMemberFound]: ',
        //   manipuleDatabase.times[indexFromMemberFound],
        // );

        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'tempo alterado com sucesso.',
        });
      }
    } catch (error) {
      console.log('timeUpdate | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async timeDelete(req, res) {
    try {
      const { rawHeaders, body } = req;
      // console.log('timeDelete | rawHeaders: ', rawHeaders);
      // console.log('timeDelete | body: ', body);
      // console.log('timeDelete | database.users: ', database.users);

      const tokenFound = (rawHeaders).find(auth.findTokenAuthInHeader);

      const userFound = (database.users).find((user) => auth.findUserByTokenAuth(user, tokenFound));
      // console.log('timeDelete | userFound: ', userFound);

      const timeFound = (database.times).find((timeCycle) => queryItem(
        timeCycle,
        'id',
        parseInt(body.time_id, 10),
      ));
      // console.log('timeById | timeFound: ', timeFound);

      if (userFound === undefined) {
        res.status(401).jsonp({
          message: 'token de autenticação inválida',
        });
      } else if (timeFound === undefined) {
        res.status(404).jsonp({
          message: 'área não foi encontrada.',
        });
      } else {
        const manipuleDatabase = database;
        const indexFromMemberFound = (manipuleDatabase.times).indexOf(timeFound);
        (manipuleDatabase.times).splice(indexFromMemberFound, 1);
        // console.log('timeDelete | manipuleDatabase.times: ', manipuleDatabase.times);
        writeDatabase(manipuleDatabase);
        res.jsonp({
          message: 'tempo excluido com sucesso.',
        });
      }
    } catch (error) {
      console.log('timeDelete | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async timesByPage(req, res) {
    try {
      const { query, route } = req;
      // console.log('timesByPage | route.path: ', route.path);
      // console.log('timesByPage | query: ', query);
      // console.log('timesByPage | db.users: ', db.users);

      const areasOrderByDate = itemsByDateOrder(database.times, 'created');

      const amountItensByPage = 5;
      const currentPage = parseInt(query.page, 10);

      const numberTotalPages = Math.ceil((areasOrderByDate.length) / amountItensByPage);

      const indexSliceFinal = (currentPage * amountItensByPage);
      const indexSliceInitial = indexSliceFinal - amountItensByPage;

      const itensFromPage = areasOrderByDate.slice(indexSliceInitial, indexSliceFinal);

      const nextPage = currentPage + 1;
      const previousPage = currentPage - 1;
      // console.log(
      //   'timesByPage | numberTotalPages, nextPage, previousPage: ',
      //   numberTotalPages,
      //   nextPage,
      //   previousPage,
      // );

      const response = {
        count: areasOrderByDate.length,
        next: nextPage <= numberTotalPages ? `http://localhost:8000${route.path}?page=${nextPage}` : null,
        previous: previousPage > 0 ? `http://localhost:8000${route.path}?page=${previousPage}` : null,
        results: itensFromPage,
      };
      // console.log('timesByPage | response: ', response);
      res.jsonp(response);
    } catch (error) {
      console.log('timesByPage | error: ', error);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async timeById(req, res) {
    try {
      const { query } = req;
      console.log('timeById | query: ', query);
      // console.log('timeById | db.users: ', db.users);

      const timeFound = (database.times).find((timeCycle) => queryItem(
        timeCycle,
        'id',
        parseInt(query.time_id, 10),
      ));
      // console.log('timeById | timeFound: ', timeFound);

      if (timeFound === undefined) {
        res.status(404).jsonp({
          message: 'área não foi encontrado.',
        });
      } else {
        res.jsonp({
          area: timeFound,
        });
      }
    } catch (error) {
      console.log('timeById | error.message: ', error.message);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async timesBySkill(req, res) {
    try {
      console.log('timesBySkill | req.userId: ', req.userId);
      console.log('timesBySkill | req.params.id: ', req.params.id);

      const { page = 1 } = req.query;
      const time = await Time.paginate(
        {
          user: req.userId,
          abiliity: req.params.id,
        },
        {
          page,
          limit: 5,
          populate: { path: 'abiliity', select: '-user' },
          select: '-user',
          sort: { createAt: 'desc' },
        },
      );

      if (!time) {
        return res.status(400).send({ message: 'Time or user does not exist' });
      }

      return res.json(time);
    } catch (error) {
      console.log('timesBySkill | error: ', error);
      res.status(500).jsonp({
        error: error.message,
      });
    }
  },

  async timeFilterByAbiliityAndDate(req, res) {
    try {
      console.log('timeFilterByAbiliityAndCreatedInCurrentMonth | user: ', req.userId);
      console.log('timeFilterByAbiliityAndCreatedInCurrentMonth | req.params.id: ', req.params.id);
      const { date } = req.query;
      console.log('timeFilterByAbiliityAndCreatedInCurrentMonth | date: ', date);

      const currentDate = new Date(date);
      console.log('timeFilterByAbiliityAndCreatedInCurrentMonth | currentDate.getDay(): ', currentDate.getDay());
      const beginMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      console.log('timeFilterByAbiliityAndCreatedInCurrentMonth | beginMonthDate: ', beginMonthDate);
      const endMonthDate = new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1), 0);
      console.log('timeFilterByAbiliityAndCreatedInCurrentMonth | endMonthDate: ', endMonthDate);

      const time = await Time.find({
        createAt: { $gte: beginMonthDate, $lte: endMonthDate },
        user: req.userId,
        abiliity: req.params.id,
      }).populate({ path: 'abiliity', select: '-user' }).select('-user');

      if (!time) {
        return res.status(400).send({ message: 'time does not exist' });
      }

      return res.json(time);
    } catch (error) {
      console.log('timeFilterByAbiliityAndCreatedInCurrentMonth | error: ', error);
      res.status(500).send(error);
    }
  },
};
