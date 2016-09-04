import {createHmac} from 'crypto';
import {SHOPIFY_SHARED_SECRET} from './constants';
import {get as getEnv} from './env';

var getRawBody = require('raw-body');
var typer = require('media-typer')

export function webhookAuth(req, res, next) {
  console.log('fetching data has started!');

  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: typer.parse(req.headers['content-type']).parameters.charset
  }, function (err, string) {
    if (err) {
      console.error(err);
      return res.sendStatus(401);
    }

    const createdHmac = createHmac("SHA256", getEnv(SHOPIFY_SHARED_SECRET)).update(new Buffer(string, 'utf8')).digest('base64');
    const hmacHeader = req.get('HTTP_X_SHOPIFY_HMAC_SHA256');

    if (createdHmac !== hmacHeader) {
      console.warn('HTTP_X_SHOPIFY_HMAC_SHA256 header does not match calculated HMAC');
      return res.sendStatus(401);
    }

    next()
  });
}

