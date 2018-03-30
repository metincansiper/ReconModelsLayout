const { readModelIds } = require('./util/models.js');
const { queryReconGraphData } = require('./util/queryReconService');
const regCyExt = require('./util/regCyExt');
const { createNewCy, updateEles } = require('./util/cyInstance');
const { exportToJson } = require('./util/toJson');
const { getLayout, runLayout, bindLayoutEvent } = require('./util/layout');
const xmlStrToCyJson = require('./util/xmlStrToCyJson');

regCyExt();
let cy = createNewCy();
let modelIDs = readModelIds();

// process models starting from index
let processModels = (index) => {
  if (index === modelIDs.length) {
    return;
  }

  let modelID = modelIDs[index];

  queryReconGraphData(modelID).then( (xmlStr) => {

    let cyJson = xmlStrToCyJson(xmlStr);
    updateEles(cy, cyJson);

    let layout = getLayout(cy);

    let onLayoutStop = () => {
      exportToJson(cy, modelID);
      // pass to the next model
      processModels(index + 1);

      console.log('layout stop');
    };

    console.log('running layout for ' + cy.nodes().length + ' nodes');

    bindLayoutEvent(layout, 'layoutstop', onLayoutStop);
    runLayout(layout);
  } );
};

processModels(0);
