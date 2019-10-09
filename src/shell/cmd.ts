/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

import { spawn } from 'child_process';
import ansi from 'strip-ansi';
import chalk from 'chalk';
import Result from './result';

// A general purpose structure that can be used for any command.
// This defines the important 'spawn' command. This executes the command
// with the arguments that have been specified.
// It is set to inherit the environment variables, uses the default sell, and inherits the
// stdio/stderr streams. (Inheriting means that the formating colour, etc is maintained)
//
// spawn() MUST be the last item chained sequence
//
// It also blanks the arguments supplied, so the instance of the cmd can be reused
// It returns a promise that is resolved when the exit code is 0, and rejected for any other code
export default class Cmd {
    public static async shell(cmds): Promise<Result[]> {
        const retvals: Result[] = [];
        for (const c of cmds) {
            const cmd = new Cmd(c);
            await cmd.spawn();
            const result: Result = {
                cmd : c,
                rc : cmd.rc,
                stderr: cmd.stderrstr,
                stdout: cmd.stdoutstr,
            };
            retvals.push(result);
        }
        return retvals;
    }
    private cmd = '';
    private args = [];
    private stdoutstr = [];
    private stderrstr = [];
    private rc = 0;

    public constructor(cmd) {
        this.cmd = cmd;
    }

    private stdioSettings =  ['inherit', 'pipe', 'pipe'];
    public cachedStd(flag: boolean) {
        if(flag){
            this.stdioSettings =  ['inherit', 'pipe', 'pipe'];
        } else {
           this.stdioSettings =  ['inherit', 'inherit', 'inherit'];
    }

    // can override the cwd
    public spawn(cwd = process.cwd()) {
        const promise = new Promise((resolve, reject) => {
            const _name = this.toString();
            // eslint-disable-next-line no-console
            console.log(chalk`{green spawning::} ${_name} in ${cwd}`);
            const call = spawn(this.cmd, this.args, { env: process.env, shell: true, stdio: ['inherit', 'pipe', 'pipe'], cwd });
            this.args = [];
            this.stdoutstr = [];
            call.on('exit', (code) => {
                // eslint-disable-next-line no-console
                const rc: string = `${code}`;
                console.log(chalk`{green spawned::} Return Code ${rc}`);
                this.rc = code;
                resolve(code);

            });
            call.stdout.on('data', (data) => {
                let s = data.toString('utf8');
                s = s.slice(0, s.length - 1);
                console.log(chalk`{blue.bold [stdout]} ${s}`);
                this.stdoutstr.push(ansi(s));
            });
            call.stderr.on('data', (data) => {
                let s = data.toString('utf8');
                s = s.slice(0, s.length - 1);
                console.error(chalk`{red.bold [stderror]} ${s}`);
                this.stderrstr.push(ansi(s));
            });
            return call;
        });

        return promise;
    }

    public toString(): string {
        return `${this.cmd} ${this.args.join(' ')}`;
    }

}

