import application from './../application';
import * as express from 'express';

application.get('/', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  res.status(200).json({"status": "ok!"});
}

