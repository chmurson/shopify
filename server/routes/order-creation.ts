import application from './../application';
import {insertOrUpdateDocument} from './../database';
import * as express from 'express';
import {ORDERS_COLLECTION_NAME} from './../model';

import {createFailureJson, createSuccessJson} from './../jsonResponses';

/**
 * This is hook for shopify. Requested once checkout is finished (user goes to thank you page), which is creation of order.
 */
application.post('/order-creation', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  //@todo here should be API verification
  const document = req.body;

  if (!document.checkout_token) {
    res.status(400).json(createFailureJson("Document has no checkout_token"));
  }

  insertOrUpdateDocument(ORDERS_COLLECTION_NAME, document, 'checkout_token');
  res.json(createSuccessJson());
}