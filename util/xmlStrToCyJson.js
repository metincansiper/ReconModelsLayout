const parseString = require('xml2js').parseString;

// width and height for simple nodes
const SIMPLE_NODE_WIDTH = 30;
const SIMPLE_NODE_HEIGHT = 30;

let xmlStrToCyJson = (xmlStr) => {
  // JSON object to load the graph to Cytoscape.js
  let cytoscapeJsGraph = {};

  parseString(xmlStr, (err, result) => {
    // JSON arrays for nodes and edges
    let cytoscapeJsNodes = [];
    let cytoscapeJsEdges = [];
    // map to retrieve compartments of species
    let speciesIdToCompartmentIdMap = new Map();

    cytoscapeJsGraph.nodes = cytoscapeJsNodes;
    cytoscapeJsGraph.edges = cytoscapeJsEdges;

    let compartments = result.SBModel.Compartments[0].Compartment;

    //Search in compartents
    compartments.forEach( (compartment) => {
      let $compartment = compartment.$;

      let compartmentId = $compartment.ID;
      let parentId = $compartment.Outside;
      // TODO add this to data?
      // let compartmentConstant = $compartment.Constant;

      let compartmentData = {
        id: compartmentId,
        name: $compartment.Name,
        sbclass: 'compartment',
        sbmlId: $compartment.sbmlID,
        size: $compartment.Size,
        spatialDimensions: $compartment.SpatialDimensions,
        typeId: $compartment.CompartmentTypeId
      };

      if (parentId != "00000000-0000-0000-0000-000000000000") {
        compartmentData.parent = parentId;
      }

      cytoscapeJsNodes.push({
        data: compartmentData
      });

      //Search in species of that compartment
      compartment.SpeciesAll.forEach( (speciesAll) => {
        let speciesList = speciesAll.Species;

        speciesList.forEach( (species) => {
          let $species = species.$;

          let speciesId = $species.ID;

          //Mark the compartment of that species
          speciesIdToCompartmentIdMap.set(speciesId, compartmentId);

          cytoscapeJsNodes.push({
            data: {
              id: speciesId,
              parent: compartmentId,
              name: $species.Name,
              sbclass: 'species',
              sbmlId: $species.sbmlID,
              typeId: $species.SpeciesTypeId,
              initialAmount: $species.InitialAmount,
              initialConcentration: $species.InitialConcentration,
              substanceUnitsId: $species.SubstanceUnitsId,
              hasOnlySubstanceUnits: $species.HasOnlySubstanceUnits,
              boundaryCondition: $species.BoundaryCondition,
              charge: $species.Charge,
              constant: $species.Constant,
              isCommon: $species.IsCommon,
              width: SIMPLE_NODE_WIDTH,
              height: SIMPLE_NODE_HEIGHT
            }
          });

        } );
      } );
    } );

    let reactions = result.SBModel.Reactions[0].Reaction;

    //Search in reactions
    reactions.forEach( (reaction) => {
      let $reaction = reaction.$;

      let reactionId = $reaction.ID;
      let reversible = $reaction.reversible;
      let compartmentId;

      //Get edge data by reaction species
      reaction.ReactionSpeciesAll.forEach( (speciesAll) => {
        let speciesList = speciesAll.ReactionSpecies;
        speciesList.forEach( (species) => {
          let $species = species.$;

          let speciesId = $species.SpeciesId;
          let roleId = $species.RoleId;
          let edgeId = $species.ID;
          let stoichiometry = $species.Stoichiometry;

          //Reactions are in the same compartment with their input species
          if (!compartmentId) {
            if (roleId === 'Reactant') {
              //Get the compartment of that species
              compartmentId = speciesIdToCompartmentIdMap.get(speciesId);
            }
          }

          let sourceId, targetId;
          [sourceId, targetId] = ( roleId === 'Reactant' ) ? [speciesId, reactionId] : [reactionId, speciesId];

          var edgeData = {
            id: edgeId,
            source: sourceId,
            target: targetId,
            stoichiometry: stoichiometry
          };

          if (reversible === 'True') {
            edgeData.sbclass = "two sided";
          };

          cytoscapeJsEdges.push({
            data: edgeData
          });
        } );
      } );

      cytoscapeJsNodes.push({
        data: {
          id: reactionId,
          sbclass: 'reaction',
          parent: compartmentId,
          name: $reaction.Name,
          reversible: reversible,
          sbmlId: $reaction.sbmlId,
          kineticLawId: $reaction.KineticLawId,
          fast: $reaction.Fast,
          width: SIMPLE_NODE_WIDTH,
          height: SIMPLE_NODE_HEIGHT
        }
      });
    } );
  });

  return cytoscapeJsGraph;
};

module.exports = xmlStrToCyJson;
