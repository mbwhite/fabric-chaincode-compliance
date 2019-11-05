/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/
import { binding, given, then, when } from 'cucumber-tsflow';
import { FABRIC_STATE, LONG_STEP } from '../constants';
import Cmd from '../shell/cmd';
import Workspace from './workspace';

import * as logger from 'winston';

import * as path from 'path';
import { StateStore } from '../statestore';
const stateStore = StateStore.getInstance();

@binding([Workspace])
export class NetworkSteps {
  private accountBalance: number = 0;

  public constructor(protected workspace: Workspace) { }

  /*
   * TODO: provide ability to customise which one this is
  */
  @given(/The '(.+?)' network has been started/, null, LONG_STEP)
  public async startNetwork(name): Promise<void> {

    process.env.COMPOSE_PROJECT_NAME = name;

    const fabricState = stateStore.get(FABRIC_STATE);
    if (!fabricState) {
      const workingDir = path.resolve(__dirname, '..', '..'); // replace with workspace
      await Cmd.shell([

        'docker kill $(docker ps | grep "dev-peer0.org[12].example.com" | awk \'{print $1}\') || echo ok',
        'docker rm $(docker ps -a | grep "dev-peer0.org[12].example.com" | awk \'{print $1}\') || echo ok',

        // remove chaincode images so that they get rebuilt during test
        'docker rmi $(docker images | grep "^dev-peer0.org[12].example.com" | awk \'{print $3}\') || echo ok',

        `docker-compose -f network-resources/${name}/docker-compose-cli.yaml down --volumes`,
        `docker-compose -f network-resources/${name}/docker-compose-cli.yaml up -d`], workingDir, false);
      stateStore.set(FABRIC_STATE, { name, deployed: true });
    }

  }

  @given(/The required channel has been created/, null, LONG_STEP)
  public async channelSetup(): Promise<void> {

    const fabricState = stateStore.get(FABRIC_STATE);
    if (!fabricState) {
      throw new Error('Kinda need the fabric running....');
    } else if (!fabricState.channel) {
      await Cmd.shell(['docker exec cli ./scripts/script-channel-create.sh']);
      fabricState.channel = true;
      stateStore.set(FABRIC_STATE, fabricState);
    }

  }

  @given(/The '(.+?)' chaincode has been deployed/, null, LONG_STEP)
  public async chaincodeDeploy(name: string): Promise<void> {

    const fabricState = stateStore.get(FABRIC_STATE);
    if (!fabricState) {
      throw new Error('Kinda need the fabric running....');
    } else if (fabricState.channel) {

      const cfg = stateStore.get('CFG');
      // let ccs = cfg['chaincodes'].filter(e => { return e.name === name; });
      let pathName = path.join(cfg['chaincodeDir'],name);
      logger.info(`Going for ${name} at ${pathName}`);
      await Cmd.shell([`docker exec cli ./scripts/script-cc-deploy.sh mychannel 3 node 10 false ${pathName} ${name}`],process.cwd(),false);
      fabricState.channel = true;
      stateStore.set(FABRIC_STATE, fabricState);
    }
  }

  @then(/I can submit a transaction '(.+?)' with arguments '(.+?)'/)
  // @then('I can submit a transaction {string} with result {string}')
  public async submit(name, args): Promise<void> {

    const argsToSend = { Args: [] };
    argsToSend.Args.push(name),
      argsToSend.Args = argsToSend.Args.concat(JSON.parse(args));

    // will put all the logic here but quite a bit to move around later
    const str = `docker exec cli peer chaincode invoke -C mychannel -n basic -c '${JSON.stringify(argsToSend)}' --waitForEvent --peerAddresses peer0.org1.example.com:7051 --peerAddresses peer0.org1.example.com:7051 2>&1 `;

    this.workspace.$results = await Cmd.shell([str]);

  }

  @then(/I can confirm the (simple|composite) key '(.+?)' has value '(.+?)'/)
  // @then('I can submit a transaction {string} with result {string}')
  public async confirm(keyType, name, args): Promise<void> {
    let fnName;
    if (keyType === 'simple') {
      fnName = 'org.mynamespace.crud:getKey';
    } else {
      fnName = 'org.mynamespace.crud:getCompositeKey';
    }
    const argsToSend = { Args: [] };
    argsToSend.Args.push(name),
      argsToSend.Args = argsToSend.Args.concat(JSON.parse(args));

    // will put all the logic here but quite a bit to move around later
    const str = `docker exec cli peer chaincode invoke -C mychannel -n basic -c '${JSON.stringify(argsToSend)}' --waitForEvent --peerAddresses peer0.org1.example.com:7051 --peerAddresses peer0.org1.example.com:7051 2>&1 `;

    this.workspace.$results = await Cmd.shell([str]);
    console.log(this.workspace.$results);
  }

  @then(/The result should be succes/)
  public async success(): Promise<void> {
    logger.debug(this.workspace.$results);
    if (!this.workspace.isInvokeSuccess()) {
      throw new Error('Should have completed succesfully');
    }
  }

  @then(/The result should be failure/)
  public async falure(): Promise<void> {
    logger.debug(this.workspace.$results);
    if (this.workspace.isInvokeSuccess()) {
      throw new Error('Should have completed with failure');
    }
  }

}
