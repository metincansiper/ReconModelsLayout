const fs = require('fs');

let exportToJson = (graphJson, modelId) => {
  let filePath = 'out/' + modelId + '.json';
  let fileContent = JSON.stringify(graphJson);

  fs.writeFile(filePath, fileContent, (err) => {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved for " + modelId);
  });
}

module.exports = exportToJson;
