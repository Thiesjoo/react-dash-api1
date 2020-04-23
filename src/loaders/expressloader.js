const express = require('express')
const cors = require('cors')


const errorHandling = require("../helpers/errorHandling")
const routes = require("../api")

module.exports = ({ app }) => {
  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // const whitelist = ["https://react-dash.now.sh/", "http://localhost:8090"]
  // app.use(cors({
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true)
  //     } else {
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   }
  // }))
  //FIXME: Add CORS back

  //CORS for all options requests
  app.options('*', cors());

  //Cookie setup
  let cookieParser = require('cookie-parser')
  app.use(cookieParser())

  //EXPRESS PROTECTION
  const helmet = require('helmet');
  const xss = require('xss-clean');
  app.use(helmet());
  app.use(xss());

  //JSON Parsing
  app.use(express.json({ limit: '5kb' })); // Body limit is 5kb too protect against large files

  //No caching for any of the routes
  const nocache = require('nocache');
  app.use(nocache());
  app.set("etag", false)
  


  // Load API routes
  app.use("/", routes());

  errorHandling(app)
};
