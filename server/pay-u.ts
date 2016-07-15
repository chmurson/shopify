import * as request from 'request-promise';

const payUrl = 'https://secure.payu.com';

const authUrl = payUrl + '/pl/standard/user/oauth/authorize';
const payUOrderCreationUrl = payUrl + '/api/v2_1/orders/';

export function getAccessToken(clientId:(string | number), clientSecret:string):Promise<string> {
  return request({
    method: 'POST',
    url: authUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    json: true,
    resolveWithFullResponse: true
  }).then((response:any) => {
    if (response.body.access_token) {
      return response.body.access_token;
    }
    return Promise.reject({
      responseStatusCode: response.statusCode,
      responseBody: response.body,
    });
  });
}

export function createNewOrder(authToken:string, requestBody:{}):Promise<CreateNewOrderResponse> {
  return request({
    method: 'POST',
    url: payUOrderCreationUrl,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
    json: true,
    body: requestBody,
    simple: false,
    resolveWithFullResponse: true
  }).then((response)=> {
    if (response.statusCode >= 200 && response.statusCode < 400) {
      return <CreateNewOrderResponse> response.body;
    }
    return Promise.reject({
      responseStatusCode: response.statusCode,
      responseBody: response.body,
    });
  });
}

export interface CreateNewOrderResponse {
  orderId:string,
  status:{statusCode:string},
  redirectUri:string
}