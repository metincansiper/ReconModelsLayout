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
    console.log('all models are processed');
    cy.destroy(); // this is needed to finish script if cyEnabled option of cy is set
    return;
  }

  let modelID = modelIDs[index];

  queryReconGraphData(modelID).then( (xmlStr) => {
    let cyJson = xmlStrToCyJson(xmlStr);
    updateEles(cy, cyJson);

    let layout = getLayout(cy);

    let onLayoutStop = () => {
      exportToJson(cy, modelID);

      console.log('layout stopped');

      // pass to the next model
      processModels(index + 1);
    };

    console.log('running layout for ' + cy.nodes().length + ' nodes');

    bindLayoutEvent(layout, 'layoutstop', onLayoutStop);
    runLayout(layout);
  } );
};

processModels(0);
