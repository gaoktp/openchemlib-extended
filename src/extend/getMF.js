'use strict';

/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @returns {String}
 */

module.exports = function getMF() {
    var entries = this.getFragments();
    var result = {};
    var parts = [];
    var allAtoms = [];
    entries.forEach(function (entry) {
        var mf = getFragmentMF(entry);
        parts.push(mf);
    });

    var counts = {};
    for (var part of parts) {
        if (!counts[part]) counts[part] = 0;
        counts[part]++;
    }
    parts = [];
    for (var key of Object.keys(counts).sort()) {
        if (counts[key] > 1) {
            parts.push(counts[key] + key);
        } else {
            parts.push(key);
        }
    }

    result.parts = parts;
    result.mf = getMF(allAtoms);
    return result;

    function getFragmentMF(molecule) {
        var atoms = [];
        for (var i = 0; i < molecule.getAllAtoms(); i++) {
            var atom = {};
            atom.charge = molecule.getAtomCharge(i);
            atom.label = molecule.getAtomLabel(i);
            atom.mass = molecule.getAtomMass(i);
            atom.implicitHydrogens = molecule.getImplicitHydrogens(i);
            atoms.push(atom);
            allAtoms.push(atom);
        }
        return getMF(atoms);
    }


    function getMF(atoms) {
        var charge = 0;
        var mfs = {};
        for (var atom of atoms) {
            var label = atom.label;
            charge += atom.charge;
            if (atom.mass) {
                label = '[' + atom.mass + label + ']';
            }
            var mfAtom = mfs[label];
            if (!mfAtom) {
                mfs[label] = 0;
            }
            mfs[label] += 1;
            if (atom.implicitHydrogens) {
                if (!mfs.H) mfs.H = 0;
                mfs.H += atom.implicitHydrogens;
            }
        }

        var mf = '';
        var keys = Object.keys(mfs).sort(function (a, b) {
            if (a === 'C') return -1;
            if (b === 'C') return 1;
            if (a === 'H' && b !== 'C') return -1;
            if (a !== 'C' && b === 'H') return 1;
            if (a < b) return -1;
            return 1;
        });
        for (var key of keys) {
            mf += key;
            if (mfs[key] > 1) mf += mfs[key];
        }

        if (charge > 0) {
            mf += '(+' + ((charge > 1) ? charge : '') + ')';
        } else if (charge < 0) {
            mf += '(' + ((charge < -1) ? charge : '-') + ')';
        }
        return mf;
    }

};
