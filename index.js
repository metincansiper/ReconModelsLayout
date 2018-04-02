const fspath = require('fs-path');
const fs = require('fs');

const { readModelIds } = require('./util/models.js');
const { queryReconGraphData } = require('./util/queryReconService');
const regCyExt = require('./util/regCyExt');
const { createNewCy, updateEles } = require('./util/cyInstance');
const { exportToJson } = require('./util/toJson');
const { getLayout, runLayout, bindLayoutEvent } = require('./util/layout');
const xmlStrToCyJson = require('./util/xmlStrToCyJson');
const { USE_STORED_RGD, SAVE_QUERIED_RGD } = require('./config');

regCyExt();
let cy = createNewCy();
let modelIDs = readModelIds();

// process models starting from index
let processModels = (index) => {
  if (index === modelIDs.length) {
    console.log('all models are processed or skipped');
    cy.destroy(); // this is needed to finish script if cyEnabled option of cy is set
    return;
  }

  let modelID = modelIDs[index];
  let filepath = 'xml/' + modelID + '.xml';

  let handleXML = (xmlStr) => {
    let cyJson = xmlStrToCyJson(xmlStr);
    updateEles(cy, cyJson);

    let layout = getLayout(cy);

    let onLayoutStop = () => {
      console.log('layout stopped');

      exportToJson(cy, modelID);
      // pass to the next model
      processModels(index + 1);
    };

    console.log('running layout for ' + cy.nodes().length + ' nodes');

    bindLayoutEvent(layout, 'layoutstop', onLayoutStop);
    runLayout(layout);
  };

  // error callback for query graph service
  let handleError = (err) => {
    console.log('encountered error: ', err, ' while querying ' , modelID, ' will try the next model in a short while');
    setTimeout(() => processModels(index + 1), 1000); // not sure if the short wait here makes sense
  };

  // success callback for query graph service
  let success = (xmlStr) => {
    // save queried recon graph data according to related config option
    if ( SAVE_QUERIED_RGD ) {
      fspath.writeFileSync(filepath, xmlStr);
    }

    handleXML(xmlStr);
  };

  let retrieveGraphData = () => {
    // if stored recon graph data exists and should be used use it else query graph data
    if ( USE_STORED_RGD && fs.existsSync(filepath) ) {
      let xmlStr = fs.readFileSync(filepath);
      handleXML(xmlStr);
    }
    else {
      queryReconGraphData(modelID).then( success, handleError );
    }
  };

  retrieveGraphData();
};

processModels(0);
