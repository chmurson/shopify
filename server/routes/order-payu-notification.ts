import application from './../application';
import * as express from 'express';
import {insertDocument, getDocuments, updateDocument} from './../database';
import {ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, ORDERS_COLLECTION_NAME} from './../model';
import {createFailureJson, createSuccessJson} from '../jsonResponses';

application.post('/order-payu-notification', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  if (!req.body.order || !req.body.order.extOrderId) {
    return res.status(500).json(createFailureJson("no extOrderId set"));
  }
  const extOrderId = req.body.order.extOrderId;
  const completedNotificationQuery = {
    "order.extOrderId": extOrderId.toString(),
    "order.status": "COMPLETED"
  };
  getDocuments(ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, completedNotificationQuery)
    .then(docs=> {
      if (docs[0]) {
        return "Order is already COMPLETED - no further notifications are accepted";
      }
      return insertNotificationAndUpdateOrder()
    })
    .then((msg)=> {
      res.status(200).json(createSuccessJson(msg));
    })
    .catch((error)=> {
      res.status(500).json(createFailureJson(error || "Unknown error"))
    });

  function insertNotificationAndUpdateOrder() {
    return getDocuments(ORDERS_COLLECTION_NAME, {order_number: parseInt(extOrderId)}) //order_number in original orders collections are stored as numbers
      .then(docs=> {
        if (!docs[0]) {
          return Promise.reject(`No order with ${extOrderId} found`);
        }
        docs[0].payU.status = req.body.order.status;
        return updateDocument(ORDERS_COLLECTION_NAME, docs[0]);
      }).then(()=> {
        return insertDocument(ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, req.body)
      });
  }
}

