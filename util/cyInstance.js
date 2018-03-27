const cytoscape = require('cytoscape');

let createNewCy = (opts = {}) => {
  let cy = this.cy = cytoscape(opts);
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
