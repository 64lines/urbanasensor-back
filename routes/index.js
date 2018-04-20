var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')(/*options*/);
var db = pgp('postgres://comba-1:liferay@localhost:5432/lportal');

let executeQuery = (sqlQuery, res) => {
  db.any(sqlQuery)
    .then((data) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    })
    .catch((error) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify([{
        message: 'No hay registros disponibles.',
        error: error
      }]));
    }); 
};

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/posts', (req, res, next) => {
  const startDate = req.query.param1;
  const endDate = req.query.param2;

  const sqlQuery = `
    SELECT 
      TO_CHAR(fecha :: DATE, 'yyyy-mm-dd') as fecha, 
      polaridad, sum(retweets) as retweets, 
      count(urbanatweetid) as "Nro. Tweets"
    FROM public.vz_urbanatweet 
    WHERE polaridad IS NOT NULL 
      AND fecha BETWEEN TO_DATE('${startDate}', 'yyyy-mm-dd') 
      AND TO_DATE('${endDate}', 'yyyy-mm-dd') GROUP BY FECHA, POLARIDAD`;

  executeQuery(sqlQuery, res);
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sqlQuery = `
    SELECT *
    FROM public.user 
    WHERE username = '${username}'
      AND password = '${password}'`;

  executeQuery(sqlQuery, res); 
});

router.get('/login', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  const sqlQuery = `
    SELECT *
    FROM public.user 
    WHERE username = '${username}'
      AND password = '${password}'`;

  executeQuery(sqlQuery, res); 
});

router.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const lastname = req.body.lastname;
  const email = req.body.email;

  const sqlQuery = `
    INSERT INTO public.user(
      username, password, name, lastname, email)
    VALUES ('${username}', '${password}', '${name}', '${lastname}', '${email}');`;

  executeQuery(sqlQuery, res); 
});

router.get('/register', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const name = req.query.name;
  const lastname = req.query.lastname;
  const email = req.query.email;

  const sqlQuery = `
    INSERT INTO public.user(
      username, password, name, lastname, email)
    VALUES ('${username}', '${password}', '${name}', '${lastname}', '${email}');`;

  executeQuery(sqlQuery, res); 
});

module.exports = router;
