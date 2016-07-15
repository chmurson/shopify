import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

const application = express();
application.use(bodyParser.json());
application.use(cors());

export default application;
