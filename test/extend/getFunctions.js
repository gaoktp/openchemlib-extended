'use strict';

var OCLE = require('../..');

describe('getFunctions test acetone', function () {
    it('should yield to ketone', function () {
        var molecule=OCLE.Molecule.fromSmiles('CC(=O)C');
        var functions=molecule.getFunctions();

        functions.length.should.equal(1);
        functions[0].name.should.equal('ketone');
        functions[0].atomMap.should.eql([ 1, 2 ]);
    });
});
