const parseString = require('xml2js').parseString;
const _ = require('lodash');

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

    let compartments = _.get(result, 'SBModel.Compartments[0].Compartment', []);

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
      _.get(compartment, 'SpeciesAll', []).forEach( (speciesAll) => {
        let speciesList = _.get(speciesAll, 'Species', []);

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

    let reactions = _.get(result, 'SBModel.Reactions[0].Reaction', []);

    //Search in reactions
    reactions.forEach( (reaction) => {
      let $reaction = reaction.$;

      let reactionId = $reaction.ID;
      let reversible = $reaction.reversible;
      let reactantCompartmentId, productCompartmentId;

      //Get edge data by reaction species
      _.get(reaction, 'ReactionSpeciesAll', []).forEach( (speciesAll) => {
        let speciesList = _.get(speciesAll, 'ReactionSpecies', []);
        speciesList.forEach( (species) => {
          let $species = species.$;

          let speciesId = $species.SpeciesId;
          let roleId = $species.RoleId;
          let edgeId = $species.ID;
          let stoichiometry = $species.Stoichiometry;

          // set reactantCompartmentId or productCompartmentId according to role of species in reaction
          if (!reactantCompartmentId && roleId === 'Reactant') {
            reactantCompartmentId = speciesIdToCompartmentIdMap.get(speciesId);
          }
          else if(!productCompartmentId && roleId === 'Product') {
            productCompartmentId = speciesIdToCompartmentIdMap.get(speciesId);
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

      // Reactions are ideally in the same compartment with their input(reactant) species
      // but we are supposed to put them with the same compartement of their output(product) speciesId
      // if we have no information about input species
      let compartmentId = reactantCompartmentId || productCompartmentId;

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
