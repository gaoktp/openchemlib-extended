'use strict';

module.exports = function (OCL) {
    return function getAtomsInfo() {

        this.ensureHelperArrays(OCL.Molecule.cHelperRings);

        var diaIDs = this.getDiastereotopicAtomIDs();

        var results = [];
        for (var i = 0; i < diaIDs.length; i++) {
            var result = {
                oclID: diaIDs[i],
                extra: {
                    singleBonds: 0,
                    doubleBonds: 0,
                    tripleBonds: 0,
                    aromaticBonds: 0,
                    cnoHybridation: 0 // should be 1 (sp), 2 (sp2) or 3 (sp3)
                }
            };
            var extra = result.extra;
            results.push(result);
            result.abnormalValence = this.getAtomAbnormalValence(i); // -1 is normal otherwise specified
            result.charge = this.getAtomCharge(i);
            result.cipParity = this.getAtomCIPParity(i);
            result.color = this.getAtomColor(i);
            result.customLabel = this.getAtomCustomLabel(i);
//        result.esrGroup=this.getAtomESRGroup(i);
//        result.esrType=this.getAtomESRType(i);
            result.atomicNo = this.getAtomicNo(i);
            result.label = this.getAtomLabel(i);
//        result.list=this.getAtomList(i);
//        result.listString=this.getAtomListString(i);
//        result.mapNo=this.getAtomMapNo(i);
            result.mass = this.getAtomMass(i);
//        result.parity=this.getAtomParity(i);
//        result.pi=this.getAtomPi(i);
//        result.preferredStereoBond=this.getAtomPreferredStereoBond(i);
//        result.queryFeatures=this.getAtomQueryFeatures(i);
            result.radical = this.getAtomRadical(i);
            result.ringBondCount = this.getAtomRingBondCount(i);
//        result.ringCount=this.getAtomRingCount(i);
            result.ringSize = this.getAtomRingSize(i);
            result.x = this.getAtomX(i);
            result.y = this.getAtomY(i);
            result.z = this.getAtomZ(i);
            result.allHydrogens = this.getAllHydrogens(i);
            result.connAtoms = this.getConnAtoms(i);
            result.allConnAtoms = this.getAllConnAtoms(i);

            result.implicitHydrogens = result.allHydrogens + result.connAtoms - result.allConnAtoms;

            result.isAromatic = this.isAromaticAtom(i);
            result.isAllylic = this.isAllylicAtom(i);
            result.isStereoCenter = this.isAtomStereoCenter(i);
            result.isRing = this.isRingAtom(i);
            result.isSmallRing = this.isSmallRingAtom(i);
            result.isStabilized = this.isStabilizedAtom(i);

            // todo HACK to circumvent bug in OCL that consider than an hydrogen is connected to itself
            result.extra.singleBonds = (result.atomicNo === 1) ? 0 : result.implicitHydrogens;
            for (var j = 0; j < this.getAllConnAtoms(i); j++) {
                var bond = this.getConnBond(i, j);
                var bondOrder = this.getBondOrder(bond);
                if (this.isAromaticBond(bond)) {
                    extra.aromaticBonds++;
                } else if (bondOrder === 1) {
                    // not an hydrogen
                    extra.singleBonds++;
                } else if (bondOrder === 2) {
                    extra.doubleBonds++;
                } else if (bondOrder === 3) {
                    extra.tripleBonds++;
                }
            }
            result.extra.totalBonds = result.extra.singleBonds + result.extra.doubleBonds +
                result.extra.tripleBonds + result.extra.aromaticBonds;

            if (result.atomicNo === 6) {
                result.extra.cnoHybridation = result.extra.totalBonds - 1;
            } else if (result.atomicNo === 7) {
                result.extra.cnoHybridation = result.extra.totalBonds;
            } else if (result.atomicNo === 8) {
                result.extra.cnoHybridation = result.extra.totalBonds + 1;
            } else if (result.atomicNo === 1) {
                var connectedAtom = (this.getAllConnAtoms(i) === 0) ? 0 : this.getAtomicNo(this.getConnAtom(i, 0));
                result.extra.hydrogenOnAtomicNo = connectedAtom;
                if (connectedAtom === 7 || connectedAtom === 8) {
                    result.extra.labileHydrogen = true;
                }
            }
        }
        return results;
    };
};
