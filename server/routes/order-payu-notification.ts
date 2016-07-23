import application from './../application';
import * as express from 'express';
import {insertDocument, getDocuments} from './../database';
import {ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME} from './../model';
import {createFailureJson, createSuccessJson} from '../jsonResponses';

application.post('/order-payu-notification', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  if (!req.body.order || !req.body.order.extOrderId) {
    return res.status(500).json(createFailureJson("no extOrderId set"));
  }
  const extOrderId = req.body.order.extOrderId;

  getDocuments(ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, {"order.extOrderId": extOrderId.toString()})
    .then(docs=> {
      if (docs[0] && docs[0].order.status === "COMPLETED") {
        return "Order is already COMPLETED - no further notifications are accepted";
      }
      return insertDocument(ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, req.body)
    })
    .then((msg)=> {
      res.status(200).json(createSuccessJson(msg))
    })
    .catch((error)=> {
      res.status(500).json(createFailureJson(error || "Unknown error"))
    });
}

