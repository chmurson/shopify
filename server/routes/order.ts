import application from './../application';
import * as express from 'express';
import {getDocuments} from './../database';
import {ORDERS_COLLECTION_NAME} from './../model';

/**
 * Returns previously saved by shopify hook (./order-creation) order
 */
application.get('/order/:checkoutToken', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  const checkoutToken = req.params.checkoutToken;

  if (!checkoutToken) {
    return res.status(400).json({
      "isSuccess": false,
      "error": "checkout token is not set"
    });
  }

  getDocuments(ORDERS_COLLECTION_NAME, {
    checkout_token: checkoutToken
  }).then(document=> {
    res.json(document);
  }).catch(error=> {
    res.status(500).json({
      "isSuccess": false,
      "error": error
    })
  });
}

