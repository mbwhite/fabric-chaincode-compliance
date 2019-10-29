/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { AfterAll, BeforeAll, setWorldConstructor } from 'cucumber';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as logger from 'winston';
import { StateStore } from './statestore';
const stateStore = StateStore.getInstance();
/** Job is to
 * Read the configuration of the chaincodes that exist
 * Ensure that they meet the specification for that type of chaincode
 * Copy them to the correct location at the CLI container can pick them up
 */
export default class Chaincodes {

    public static setup(): void {
        let cfg = JSON.parse(process.env.FCC_CONFIG);
        const src = path.resolve(cfg['chaincodeDir']);
        logger.info('Copying over the test chaincodes from ${src} ');

        const dest = path.resolve(__dirname, '..', 'network-resources', 'test-chaincodes');
        cfg['chaincodes'].forEach(element => {
            let ccname = element.name;
            logger.info(`... ${ccname}`)
            fs.emptyDirSync(path.join(dest, ccname));
            fs.copySync(path.join(src, ccname), path.join(dest, ccname));
        });

        stateStore.set('CFG', cfg);
        logger.debug(`Setting the configuration up as ${cfg}`);
    }
}

BeforeAll(() => {
    Chaincodes.setup();
});

AfterAll(() => {
    logger.info('==> Please remember to shut down all Fabric  docker images if not needed for debug ');
});
