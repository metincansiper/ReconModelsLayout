const cytoscape = require('cytoscape');
const coseBilkent = require('cytoscape-cose-bilkent');

let regCyExt = () => {
  cytoscape.use(coseBilkent);
};

module.exports = regCyExt;
