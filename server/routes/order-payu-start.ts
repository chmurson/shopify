import application from './../application';
import * as express from 'express';
import {getDocuments, updateDocument} from './../database';
import {ORDERS_COLLECTION_NAME} from './../model';
import {shopCheckoutUrl, shopUrl, backendUrl, payUClientSecret, payUPClientId} from './../config';
import {createNewOrder, getAccessToken} from './../pay-u';

application.get('/order-payu-start/:checkoutToken', requestHandler);

function requestHandler(req:express.Request, res:express.Response, next:express.NextFunction) {
  const checkoutToken = req.params.checkoutToken;

  if (!checkoutToken) {
    return res.redirect(shopUrl);
  }

  const checkoutUrl = shopCheckoutUrl + checkoutToken;
  let currentDocument = null;
  getDocuments(ORDERS_COLLECTION_NAME, {
    checkout_token: checkoutToken
  }).then(documents=> {
    if (!documents[0]) {
      return res.redirect(checkoutUrl);
    }
    currentDocument = documents[0];
    return createPayUOrderCreation(documents[0]);
  }).then(url=> {
    res.redirect(url);
  }).catch((error)=> {
    reportErrorInDocument(currentDocument, error)
      .then(()=> {
        res.redirect(checkoutUrl + `?error=true&errorNumber=${currentDocument.errors.length - 1}`);
      })
      .catch(()=> {
        res.redirect(checkoutUrl + '?error=true');
      });
  });
}

function createPayUOrderCreation(document) {
  const body = createsPayUBody(document);
  return getAccessToken(payUPClientId, payUClientSecret).then((accessToken)=> {
    return createNewOrder(accessToken, body);
  }).then((body)=> {
    document.payU = {
      orderId: body.orderId,
      redirectUri: body.redirectUri,
      status: "PENDING"
    };
    return updateDocument(ORDERS_COLLECTION_NAME, document, 'id');
  }).then(()=> {
    return document.payU.redirectUri;
  });
}

function createsPayUBody(document) {
  const totalPrice = shopifyPriceToPayU(document.total_price);
  const products = document.line_items.map((item)=> {
    return {
      name: item.name,
      unitPrice: shopifyPriceToPayU(item.price),
      quantity: item.quantity
    }
  });
  //@todo get proper point of sale
  return {
    "notifyUrl": `${backendUrl}/order-payu-notification`,
    "continueUrl": `${shopCheckoutUrl}/${document.checkout_token}/thank_you`,
    "customerIp": "127.0.0.1",
    "merchantPosId": payUPClientId,
    "description": "New order",
    "currencyCode": "PLN",
    "totalAmount": totalPrice,
    "extOrderId": document.order_number,
    "products": products
  }
}

function shopifyPriceToPayU(shopifyPrice) {
  return parseFloat(shopifyPrice) * 100;
}

function reportErrorInDocument(document, error) {
  document.errors = document.errors || [];
  document.errors.push({
    details: error,
    timestamp: new Date().toUTCString(),
    where: 'order-payu-status'
  });
  return updateDocument(ORDERS_COLLECTION_NAME, document, 'id');
}