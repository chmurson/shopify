import application from './../application';
import * as express from 'express';
import {insertDocument, getDocuments, updateDocument} from './../database';
import {ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, ORDERS_COLLECTION_NAME} from './../model';
import {createFailureJson, createSuccessJson} from '../jsonResponses';
import * as env from './../env';
import * as constants from './../constants';

const Shopify = require('shopify-api-node'); //not typings;

application.post('/order-payu-notification', requestHandler);

const ORDER_IS_ALREADY_COMPLETED_ERROR = "ORDER_IS_ALREADY_COMPLETED_ERROR";

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  console.log(req.body);
  if (!req.body.order || !req.body.order.extOrderId) {
    return res.status(500).json(createFailureJson("no extOrderId set"));
  }
  const status = req.body.order.status;
  const extOrderId = req.body.order.extOrderId;
  const completedNotificationQuery = {
    "order.extOrderId": extOrderId.toString(),
    "order.status": "COMPLETED"
  };
  getDocuments(ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, completedNotificationQuery)
    .then(docs=> {
      if (docs[0]) {
        return Promise.reject(ORDER_IS_ALREADY_COMPLETED_ERROR);
      }
      return insertNotificationAndUpdateOrder()
    })
    .then(()=> {
      if (status === "COMPLETED") {
        return markShopifyOrderAsPaid();
      }
      if (status === "CANCELED") {
        return markShopifyOrderAsCanceled();
      }
      return;
    })
    .then(()=> {
      res.status(200).json(createSuccessJson());
    })
    .catch((error)=> {
      console.error(error);
      let status = 500;
      let msg = error || "Unknown error";
      if (error === ORDER_IS_ALREADY_COMPLETED_ERROR) {
        msg = "Order is already COMPLETED - no further notifications are accepted";
        status = 200;
      }
      res.status(status).json(createFailureJson(msg))
    });

  const apiKey = env.get(constants.SHOPIFY_API_KEY);
  const password = env.get(constants.SHOPIFY_API_PASSWORD);
  const shopName = env.get(constants.SHOPIFY_SHOP_NAME);
  const shopify = new Shopify(shopName, apiKey, password);

  function markShopifyOrderAsCanceled() {
    console.log("markShopifyOrderAsCanceled");

    return getOrder()
      .then(order=> {
        return shopify.order.cancel(order.id);
      }).then((result)=> {
        console.log(result);
      });
  }

  function markShopifyOrderAsPaid() {
    console.log("markShopifyOrderAsPaid");
    
    return getOrder()
      .then(order=> {
        return shopify.transaction.create(order.id, {
          "amount": order.total_price,
          "kind": "capture"
        });
      }).then((result)=> {
        console.log(result);
      });
  }

  function insertNotificationAndUpdateOrder() {
    return getOrder()
      .then((order)=> {
        order.payU.status = status;
        return updateDocument(ORDERS_COLLECTION_NAME, order);
      }).then(()=> {
        return insertDocument(ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME, req.body)
      });
  }

  let orderCache:any = null;

  function getOrder():Promise<any> {
    if (orderCache) {
      return new Promise(resolve=>resolve(orderCache));
    }
    return getDocuments(ORDERS_COLLECTION_NAME, {order_number: parseInt(extOrderId)}) //order_number in original orders collections are stored as numbers
      .then(docs=> {
        if (!docs[0]) {
          return Promise.reject(`No order with ${extOrderId} found`);
        }
        return orderCache = docs[0];
      });
  }

}

