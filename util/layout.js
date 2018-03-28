const { LAYOUT_NAME } = require('../config.js');
const layoutOpts = Object.freeze({
  name: LAYOUT_NAME, // see if it will work for cose-bilkent
  animate: false
});

console.log(LAYOUT_NAME);

let getLayout = (cy) => {
  return cy.layout(layoutOpts);
};

let runLayout = (layout) => {
  layout.run();
};

let bindLayoutEvent = (layout, evtName, evtFnc) => {
  layout.on(evtName, evtFnc);
};


module.exports = { getLayout, runLayout, bindLayoutEvent };
