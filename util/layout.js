const layoutOpts = Object.freeze({
  name: 'cose-bilkent', // see if it will work for cose-bilkent
  animate: false
});

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
