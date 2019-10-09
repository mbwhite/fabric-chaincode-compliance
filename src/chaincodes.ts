
import * as fs from 'fs-extra';
import * as path from 'path';

/** Job is to
 * Read the configuration of the chaincodes that exist
 * Ensure that they meet the specification for that type of chaincode
 * Copy them to the correct location at the CLI container can pick them up
 */
export default class Chaincodes {

    /** Basic for the moment */
    public static setup() {
        console.log('Copying over the test chaincodes..')
        const src = path.resolve(__dirname, '..', 'DEMO_CHAINCODE');
        const dest = path.resolve(__dirname, '..', 'network-resources', 'test-chaincodes');

        const ccname = 'basic';
        fs.emptyDirSync(path.join(dest, ccname));
        fs.copySync(path.join(src, ccname), path.join(dest, ccname));
        console.log('..done');
    }

}

Chaincodes.setup();
