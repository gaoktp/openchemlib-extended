'use strict';

var floydWarshall = require('ml-floyd-warshall');
var Matrix = require('ml-matrix');

module.exports = function getAllPaths(options = {}) {
    var fromLabel = options.fromLabel || '';
    var toLabel = options.toLabel || '';
    var minLength = (options.minLength === undefined) ? 1 : options.minLength;
    var maxLength = (options.maxLength === undefined) ? 4 : options.maxLength;


    // we need to find all the atoms 'fromLabel' and 'toLabel'
    var results = {};
    var diaIDs = this.getDiastereotopicAtomIDs();

    var connectivityMatrix = this.getConnectivityMatrix();
    // TODO have a package that allows to convert the connectivityMatrix to a distanceMatrix
    var pathLengthMatrix = floydWarshall(new Matrix(connectivityMatrix));

    for (var from = 0; from < this.getAllAtoms(); from++) {
        for (var to = 0; to < this.getAllAtoms(); to++) {
            if (!fromLabel || this.getAtomLabel(from) === fromLabel) {
                if (!toLabel || this.getAtomLabel(to) === toLabel) {
                    var key = diaIDs[from] + '_' + diaIDs[to];
                    var pathLength = pathLengthMatrix[from][to];
                    if (pathLength >= minLength && pathLength <= maxLength) {
                        if (!results[key]) {
                            results[key] = {
                                fromDiaID: diaIDs[from],
                                toDiaID: diaIDs[to],
                                fromAtoms: [],
                                toAtoms: [],
                                fromLabel: this.getAtomLabel(from),
                                toLabel: this.getAtomLabel(to),
                                pathLength: pathLength
                            };
                        }
                        if (results[key].fromAtoms.indexOf(from) === -1) results[key].fromAtoms.push(from);
                        if (results[key].toAtoms.indexOf(to) === -1) results[key].toAtoms.push(to);
                    }
                }
            }
        }
    }

    var finalResults = [];
    for (let key in results) {
        results[key].fromAtoms.sort((a, b) => a - b);
        results[key].toAtoms.sort((a, b) => a - b);
        finalResults.push(results[key]);
    }
    return finalResults;
};
