const { MODEL_IDS_PATH } = require('../config');
const { readModelIds } = require('../util/models');
const fs = require('fs');

const OUT_PATH = 'out'; // path of output files TODO: make this configurable as well
const TARGET_PATH = 'input/missingModels.csv'; // target to write the results

let allModels = readModelIds();
let outModels = fs.readdirSync(OUT_PATH);
let outModelsSet = new Set(outModels);

let missingModels = allModels.filter( file => !outModelsSet.has(file + '.json') );

fs.writeFileSync(TARGET_PATH, missingModels.join('\n\r'));
