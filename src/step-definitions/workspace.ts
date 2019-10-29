import Result from '../shell/result';

export default class Workspace {

    private results: Result[];
    private lastStatus;
    private lastMessage;

    public constructor() { }

    /**
     * Getter $lastStatus
     * @return {string[]}
     */
    public get $lastStatus(): string {
        return this.lastStatus;
    }

    public get $lastMessage(): string {
        return this.lastMessage;
    }

    /**
     * Getter $stdout
     * @return {string[]}
     */

    public get $results(): Result[] {
        return this.results;
    }

    /**
     * Setter $stdout
     * @param {string[]} value
     */
    public set $results(value: Result[]) {
        this.results = value;
        const result = value[0];
        const errorRegex = /status:(\d\d\d) message:(.*)/;
        const successRegex = /status:(\d\d\d)/;
        if (result.rc !== 0) {
            const errorDetails = result.stdout.filter((e) => e.match(/Error: .* status:/)).join();
            const matches = errorDetails.match(errorRegex);
            this.lastStatus = matches[1];
            this.lastMessage = matches[2];
        } else {
            const successDetails = result.stdout.filter((e) => e.match(/Chaincode invoke successful/)).join();
            const matches = successDetails.match(successRegex);
            this.lastStatus = matches[1];
        }
        // do some processing.
        // console.log(this.results[0].));
    }

    /*
'Error: endorsement failure during invoke. response: status:500 message:"transaction returned with failure: Error: The my asset 009 already exists" '
Chaincode invoke successful. result: status:200
    */

    public isInvokeSuccess(): boolean {
        if (this.results[0].rc === 0) {
            return true;
        } else {
            return false;
        }
    }

}
