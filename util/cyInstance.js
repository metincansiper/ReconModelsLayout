const cytoscape = require('cytoscape');

let createNewCy = () => {
  let opts = {
    style: cytoscape.stylesheet()
    .selector('node:childless')
      .style({
        'width': 'data(width)',
        'height': 'data(height)'
      }),
    styleEnabled: true,
    headless: true
  };
  let cy = cytoscape(opts);
  return cy;
};

let clearGraph = (cy) => {
  cy.remove('*');
};

let addEles = (cy, elesJson) => {
  cy.add(elesJson);
};

let updateEles = (cy, elesJson) => {
  clearGraph(cy);
  addEles(cy, elesJson);
};

module.exports = { createNewCy, updateEles };
