const cytoscape = require('cytoscape');
const coseBilkent = require('cytoscape-cose-bilkent');
const cola = require('cytoscape-cola');

let regCyExt = () => {
  cytoscape.use(coseBilkent);
  cytoscape.use(cola);
};

module.exports = regCyExt;
