const fs = require('fs');
const { MODEL_IDS_PATH, MODEL_IDS_START, MODEL_IDS_END } = require('../config');

let readModelIds = (filePath = MODEL_IDS_PATH) => {
  console.log('Reading models at ', filePath);

  let allText = fs.readFileSync(filePath).toString();
  let lines = allText.split(/\r\n|\n/);
  let modelIDs = [];

  let start = MODEL_IDS_START || 0;
  let end = MODEL_IDS_END || lines.length;

  for (var i = start; i < end; i++) {
    let data = lines[i].split(',');
    let modelId = data[0].replace(/\r|\n/, '');
    if(modelId !== '') {
      modelIDs.push(modelId);
    }
  }

  return modelIDs;
};

module.exports = { readModelIds };
