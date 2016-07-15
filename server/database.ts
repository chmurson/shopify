import * as request from 'request-promise';
import {IOrder} from "./model";

const herokuMlabApiKey = 'k3TtynWuyZNko4YLXvtm0OumzQSLgW_n';
const baseUrl = 'https://api.mlab.com/api/1/databases/heroku_hlp2r12v/collections';

/**
 * @param collectionName
 * @param document
 */
export function insertDocument(collectionName:string, document:Object) {
  const url = baseUrl + `/${collectionName}?apiKey=${herokuMlabApiKey}`;
  return request({
    uri: url,
    method: 'POST',
    body: document,
    json: true
  });
}

/**
 * @param collectionName
 * @param document
 * @param uniqueKey
 * @returns {Promise<TResult>}
 */
export function insertOrUpdateDocument(collectionName:string, document:Object, uniqueKey:string) {
  return getDocuments(collectionName, {
    [uniqueKey]: document[uniqueKey]
  }).then((documents)=> {
    return (documents.length === 0) ? insertDocument(collectionName, document) : updateDocument(collectionName, document, uniqueKey);
  });
}

/**
 * @param collectionName
 * @param query
 * @returns {requestPromise.RequestPromise}
 */
export function getDocuments(collectionName, query) {
  const url = baseUrl + `/${collectionName}?q=${JSON.stringify(query)}&apiKey=${herokuMlabApiKey}`;
  return request({
    url: url,
    method: 'GET',
    json: true
  });
}

/**
 * @param collectionName
 * @param document
 * @param uniqueKey
 */
export function updateDocument(collectionName, document, uniqueKey) {
  const query = {[uniqueKey]: document[uniqueKey]};
  const url = baseUrl + `/${collectionName}?q=${JSON.stringify(query)}&apiKey=${herokuMlabApiKey}`;
  return request({
    uri: url,
    method: 'PUT',
    body: {
      $set: document
    },
    json: true
  });
}