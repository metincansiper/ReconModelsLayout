const fs = require('fs');

// uses original data fields of elements does not use copy of them
let getElementsJson = (cy) => {
  let nodes = cy.nodes();
  let edges = cy.edges();

  let nodesData = [];
  let edgesData = [];

  // json to represent list of Cytoscape.js elements
  let elementsData = {};
  elementsData.nodes = nodesData;
  elementsData.edges = edgesData;

  nodes.forEach( (node) => {
    nodesData.push({
      data: node.data(),
      position: node.position()
    });
  } );

  // just use edges.jsons() instead?
  edges.forEach( (edge) => {
    edgesData.push({data: edge.data()});
  } );

  return elementsData;
};

let exportToJson = (cy, modelId) => {

  let filePath = 'out/' + modelId + '.json';
  let elementsData = getElementsJson(cy);
  let fileContent = JSON.stringify(elementsData);

  // write to file in sync mode to enable destroying cytoscape instance on correct time
  fs.writeFileSync(filePath, fileContent);
  console.log("The file was saved for " + modelId);
}

module.exports = { exportToJson };
