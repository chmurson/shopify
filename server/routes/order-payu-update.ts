import application from './../application';
import * as express from 'express';
import {getDocuments, updateDocument} from './../database';
import {ORDERS_COLLECTION_NAME} from './../model';
import {createSuccessJson, createFailureJson} from './../jsonResponses';

const url = '/order-payu-update';
application.post('/order-payu-update', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {

  getShopifyId()
    .then(getOrder)
    .then(updateOrder)
    .then(success)
    .catch(failure);


  /**
   * @returns {Promise<Number>|Promise}
   */
  function getShopifyId() {
    return new Promise(resolve=> resolve(req.body.id));
  }

  /**
   * @param orderId
   * @returns {Promise<object>}
   */
  function getOrder(orderId) {
    return getDocuments(ORDERS_COLLECTION_NAME, {
      id: orderId
    }).then(docs=> {
      if (docs.length === 1) {
        return docs[0];
      }
      return Promise.reject(`Could not find match for order id: ${orderId}. Results found: ${docs.length}`);
    })
  }

  /**
   * @param order
   * @returns {requestPromise.RequestPromise}
   */
  function updateOrder(order) {
    (<any>Object).assign(order, req.body);
    return updateDocument(ORDERS_COLLECTION_NAME, order);
  }

  function success() {
    res.status(200).json(createSuccessJson());
  }

  function failure(error) {
    console.warn(`Failed: ${url} ${error}`);
    res.status(500).json(createFailureJson(error));
  }
}



