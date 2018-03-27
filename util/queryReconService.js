const soap = require('soap');
const Promise = require('bluebird');
const url = 'http://ciceklab.cs.bilkent.edu.tr/PathCaseRECONService/PathwaysService.asmx?WSDL';

let queryReconGraphData = (modelId) => {
  let args = {modelID: modelId};

  return new Promise( ( resolve, reject ) => {
    soap.createClient(url, function(err, client) {
      client.GetReconGraphData(args, function(err, res) {
        // result is expected to have only one property return its value
        for (var prop in res) {
          resolve(res[prop]);
        }
      });
    });
  } );
};

module.exports = { queryReconGraphData };
