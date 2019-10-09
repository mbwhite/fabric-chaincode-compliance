import { assert } from 'chai';
import { binding, given, then, when } from 'cucumber-tsflow';
import { LONG_STEP, FABRIC_STATE } from '../timeouts';
import Workspace from './workspace';
import Cmd from '../shell/cmd';

import { StateStore } from './statestore';
const stateStore = StateStore.getInstance();

@binding([Workspace])
export class NetworkSteps {
  private accountBalance: number = 0;

  public constructor(protected workspace: Workspace) { }

  /*
   * TODO: provide ability to customise which one this is
  */
  @given(/The network has been started/, null, LONG_STEP)
  public async startNetwork(): Promise<void> {
    process.env.COMPOSE_PROJECT_NAME = 'first-network';

    const fabricState = stateStore.get(FABRIC_STATE);
    if (!fabricState) {
      await Cmd.shell([

        'docker kill $(docker ps | grep "dev-peer0.org[12].example.com" | awk \'{print $1}\') || echo ok',
        'docker rm $(docker ps -a | grep "dev-peer0.org[12].example.com" | awk \'{print $1}\') || echo ok',

        // remove chaincode images so that they get rebuilt during test
        'docker rmi $(docker images | grep "^dev-peer0.org[12].example.com" | awk \'{print $3}\') || echo ok',

        'docker-compose -f network-resources/first-network/docker-compose-cli.yaml down --volumes',
        'docker-compose -f network-resources/first-network/docker-compose-cli.yaml up -d']);
      stateStore.set(FABRIC_STATE, { deployed: true });
    }

  }

  @given(/The channel and chaincode has been deployed/, null, LONG_STEP)
  public async chaincodeDeploy(): Promise<void> {

    const fabricState = stateStore.get(FABRIC_STATE);
    if (!fabricState) {
      throw new Error('Kinda need the fabric running....');
    } else if (!fabricState.channel) {
      await Cmd.shell(['docker exec cli ./scripts/script.sh']);
      fabricState.channel = true;
      stateStore.set(FABRIC_STATE, fabricState);
    }
  }

  @then(/I submit a transaction '(.+?)' with arguments '(.+?)'/)
  // @then('I can submit a transaction {string} with result {string}')
  public async stuff(name, args): Promise<void> {

    let argsToSend = { Args: [] };
    argsToSend.Args.push(name),
      argsToSend.Args = argsToSend.Args.concat(JSON.parse(args));

    // will put all the logic here but quite a bit to move around later
    const str = `docker exec cli peer chaincode invoke -C mychannel -n basic -c '${JSON.stringify(argsToSend)}' --waitForEvent --peerAddresses peer0.org1.example.com:7051 --peerAddresses peer0.org1.example.com:7051 2>&1 `;

    this.workspace.$results = await Cmd.shell([str]);

  }

  @then(/The result should be succes/)
  public async success(): Promise<void> {
    // console.log('----------------------------------------------');
    // console.log(this.workspace.$results);
    // console.log('----------------------------------------------');
    if (!this.workspace.isInvokeSuccess()) {
      throw new Error('Should have completed succesfully');
    }
  }

  @then(/The result should be failure/)
  public async falure(): Promise<void> {
    // console.log('----------------------------------------------');
    // console.log(this.workspace.$results);
    // console.log('----------------------------------------------');
    if (this.workspace.isInvokeSuccess()) {
      throw new Error('Should have completed with failure');
    }
  }


}
