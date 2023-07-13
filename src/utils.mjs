import readline from 'node:readline';
import { createSpinner as _createSpinner } from 'nanospinner';
import { PassThrough } from 'stream';
export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export async function keypress() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question('', (answer) => {
            rl.close();
            process.stderr.moveCursor(0, -1);
            process.stderr.clearLine(1);
            resolve(answer);
        });
    });
}

export function Spinner({ ci = false } = {}) {
    return {
        createSpinner: (text, options) =>
            _createSpinner(text, {
                stream: ci ? new PassThrough() : undefined,
                ...options,
            }),
    };
}
