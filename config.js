const DEFAULT_LAYOUT_NAME = 'cose-bilkent';
const LAYOUT_NAME = process.env.LAYOUT_NAME || DEFAULT_LAYOUT_NAME;
const USE_STORED_RGD = true; // Use recon graph data stored in xml folder
const SAVE_QUERIED_RGD = true; // Store queried recon graph data to xml folder
const DEFAULT_MODEL_IDS_PATH = 'input/modelIDs.csv';
const MODEL_IDS_PATH = process.env.MODEL_IDS_PATH || DEFAULT_MODEL_IDS_PATH;
const MODEL_IDS_START = process.env.MODEL_IDS_START;
const MODEL_IDS_END = process.env.MODEL_IDS_END;

module.exports = { LAYOUT_NAME, USE_STORED_RGD, SAVE_QUERIED_RGD, MODEL_IDS_PATH, MODEL_IDS_START, MODEL_IDS_END };
