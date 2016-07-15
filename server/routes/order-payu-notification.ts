import application from './../application';
import * as express from 'express';
import {insertDocument} from './../database';
import {ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME} from './../model';

application.post('/order-payu-notification', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  insertDocument(ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, req.body)
    .then(()=>res.sendStatus(200))
    .catch(()=>res.sendStatus(500));
}

