import application from './../application';
import * as express from 'express';
import {updateDocument, getDocuments} from './../database';
import {ORDERS_COLLECTION_NAME} from './../model';
import {shopCheckoutUrl, shopUrl} from './../config';


application.get('/order-payu-end/:orderId/:isSuccess', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  const orderId = req.params.orderId;
  const isSuccess = req.params.isSuccess;

  getDocuments(ORDERS_COLLECTION_NAME, {
    'payU.orderId': orderId
  }).then(document=> {
    if (!document[0]) {
      return Promise.reject(ERROR_ORDER_NOT_FOUND);
    }
    document[0].payU.isSuccess = isSuccess === "true" ? true : false;
    return finish(document[0]);
  }, ()=> {
    res.redirect(shopUrl);
  }).then((url)=> {
    res.redirect(url);
  }).catch((error:any)=> {
    if (error === ERROR_ORDER_NOT_FOUND) {
      return res.status(400).send(`Order with id ${orderId} not found`);
    }
    if (error instanceof Error) {
      return res.status(500).json(error.message);
    }
    res.status(500).json(error);
  });
}

function finish(document) {
  return updateDocument(ORDERS_COLLECTION_NAME, document, 'id')
    .then(()=> {
      return shopCheckoutUrl + document.checkout_token;
    }, ()=> {
      return shopUrl;
    })
}


const ERROR_ORDER_NOT_FOUND = 1;