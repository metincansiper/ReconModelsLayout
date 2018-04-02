const DEFAULT_LAYOUT_NAME = 'cose-bilkent';
const LAYOUT_NAME = process.env.LAYOUT_NAME || DEFAULT_LAYOUT_NAME;
const USE_STORED_RGD = true; // Use recon graph data stored in xml folder
const SAVE_QUERIED_RGD = true; // Store queried recon graph data to xml folder

module.exports = { LAYOUT_NAME, USE_STORED_RGD, SAVE_QUERIED_RGD };
