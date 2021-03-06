import {createHmac} from 'crypto';
import {SHOPIFY_SHARED_SECRET} from './constants';
import {get as getEnv} from './env';

export function webhookAuth(req, res, next) {
  const createdHmac = createHmac("SHA256", getEnv(SHOPIFY_SHARED_SECRET)).update(new Buffer(req.rawBody, 'utf8')).digest('base64');
  const hmacHeader = req.get('HTTP_X_SHOPIFY_HMAC_SHA256');

  if (createdHmac !== hmacHeader) {
    console.warn('HTTP_X_SHOPIFY_HMAC_SHA256 header does not match calculated HMAC');
    return res.sendStatus(401);
  }

  next()
}

