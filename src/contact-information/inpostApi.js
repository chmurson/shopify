import $ from 'jquery';
import xml2js from 'xml2js';
import _ from 'lodash';
import {Paczkomat} from './paczkomat';

export class InpostApi {
  constructor() {
    this.paczkomaty = undefined;
    this.loadingPromise = undefined;
  }

  loadPaczkomaty() {
    if (!this.loadingPromise) {
      return this.loadingPromise = $.when($.ajax("https://api.paczkomaty.pl/?do=listmachines_xml"))
        .then((data, textStatus, jqXHR) => {
          return parseXmlToJs(data);
        })
        .then((rawPaczkomaty)=> {
          return rawPaczkomaty.map((p)=>new Paczkomat(p));
        })
        .done((paczkomaty)=> {
          this.paczkomaty = paczkomaty;
          return paczkomaty;
        });
    }
    return this.loadingPromise;
  }

  /**
   * @returns {Promise.<Paczkomat[]>}
   */
  getPaczkomaty() {
    if (this.paczkomaty === undefined) {
      return this.loadPaczkomaty();
    }

    return $.when(this.paczkomaty);
  }
}

function parseXmlToJs(xml) {
  const deferred = $.Deferred();
  xml2js.parseString(xml, (err, result)=> {
    if (err) {
      return deferred.reject(err)
    }
    const paczkomaty = (result.paczkomaty && result.paczkomaty.machine) ? result.paczkomaty.machine : [];
    //fix structure of paczkomats objects
    const fixedPaczkomaty = paczkomaty.map((paczkomat)=> {
      const fixedObject = {};
      _.each(paczkomat, (value, key)=> {
        if (!_.isArray(value)) {
          fixedObject[key] = value;
        } else {
          fixedObject[key] = value[0];
        }
      });
      return fixedObject;
    });
    return deferred.resolve(fixedPaczkomaty);
  });
  return deferred;
}