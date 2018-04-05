const soap = require('soap');
const Promise = require('bluebird');
const url = 'http://ciceklab.cs.bilkent.edu.tr/PathCaseRECONService/PathwaysService.asmx?WSDL';

let queryReconGraphData = (modelId) => {
  let args = {modelID: modelId};

  return new Promise( ( resolve, reject ) => {
    soap.createClient(url, function(err, client) {

      if (!client) {
        reject('Soap client could not be created while trying to query model ', modelId);
      }

      client.GetReconGraphData(args, function(err, res) {
        if (err) {
          reject(err);
        }

        // result is expected to have only one property return its value
        for (var prop in res) {
          resolve(res[prop]);
        }
      });
    });
  } );
};

module.exports = { queryReconGraphData };
