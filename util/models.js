const fs = require('fs');

let readModelIds = (filePath = 'input/modelIDs.csv') => {
  let allText = fs.readFileSync(filePath).toString();
  let lines = allText.split(/\r\n|\n/);
  let modelIDs = [];

  for (var i = 0; i < lines.length; i++) {
    let data = lines[i].split(',');
    let modelId = data[0];
    if(modelId !== '') {
      modelIDs.push(modelId);
    }
  }

  return modelIDs;
};

module.exports = { readModelIds };
