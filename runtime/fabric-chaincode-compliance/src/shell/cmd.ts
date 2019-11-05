/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

import chalk from 'chalk';
import { spawn, StdioOptions } from 'child_process';
import ansi from 'strip-ansi';
import Result from './result';

import * as logger from 'winston';

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
    public static async shell(cmds, cwd = process.cwd(), cache = true): Promise<Result[]> {
        const retvals: Result[] = [];
        for (const c of cmds) {
            const cmd = new Cmd(c).cacheStdio(cache);
            await cmd.spawn(cwd);
            const result: Result = {
                cmd: c,
                rc: cmd.rc,
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

    // stdin - inherit, stdout - pipe, stderr - pipe
    // i.e. be able to catch all of them
    private stdioSettings: StdioOptions = ['inherit', 'pipe', 'pipe'];

    public constructor(cmd) {
        this.cmd = cmd;
    }

    public cacheStdio(flag: boolean) {
        if (flag) {
            this.stdioSettings = ['inherit', 'pipe', 'pipe'];
        } else {
            this.stdioSettings = ['inherit', 'inherit', 'inherit'];
        }
        return this;
    }

    // can override the cwd
    public spawn(cwd = process.cwd()) {
        const promise = new Promise((resolve, reject) => {
            const _name = this.toString();
            // eslint-disable-next-line no-console
            console.log(chalk`{green spawning::} ${_name} in ${cwd}`);
            const call = spawn(this.cmd, this.args, { env: process.env, shell: true, stdio: this.stdioSettings, cwd });
            this.args = [];
            this.stdoutstr = [];
            call.on('exit', (code) => {
                // eslint-disable-next-line no-console
                const rc: string = `${code}`;
                console.log(chalk`{green spawned::} Return Code ${rc}`);
                this.rc = code;
                resolve(code);

            });
            if (call.stdout) {
                call.stdout.on('data', (data) => {
                    let s = data.toString('utf8');
                    s = s.slice(0, s.length - 1);
                    logger.debug(chalk`{blue.bold [stdout]} ${s}`);
                    this.stdoutstr.push(ansi(s));
                });
            }

            if (call.stderr) {
                call.stderr.on('data', (data) => {
                    let s = data.toString('utf8');
                    s = s.slice(0, s.length - 1);
                    logger.debug(chalk`{red.bold [stderror]} ${s}`);
                    this.stderrstr.push(ansi(s));
                });
            }
            return call;
        });

        return promise;
    }

    public toString(): string {
        return `${this.cmd} ${this.args.join(' ')}`;
    }

}

