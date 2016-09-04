import * as express from 'express';
import * as cors from 'cors';

const rawBodyParser = require('body-parser-rawbody');

const application = express();
application.use(rawBodyParser.json());
application.use(cors());

export default application;
