const fs = require('fs');

let readModelIds = (filePath = 'input/modelIDs.csv') => {
  let allText = fs.readFileSync(filePath).toString();
  let lines = allText.split(/\r\n|\n/);
  let modelIDs = [];

  for (var i = 0; i < lines.length; i++) {
    var data = lines[i].split(',');
    modelIDs.push(data[0]);
  }

  return modelIDs;
};

module.exports = { readModelIds };
