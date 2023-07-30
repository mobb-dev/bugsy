import { analyze, scan } from './src/commands/index.mjs';
import { CliError } from './src/utils.mjs';
import { parseArgs } from './src/yargs.mjs';
import { hideBin } from 'yargs/helpers';

async function run() {
    const args = await parseArgs(hideBin(process.argv));
    const [command] = args._;
    if (command === 'scan') {
        const { yes, ...restArgs } = args;
        await scan(restArgs, { skipPrompts: yes });
    }
    if (command === 'analyze') {
        const { yes, ...restArgs } = args;
        await analyze(restArgs, { skipPrompts: yes });
    }
}

(async () => {
    try {
        await run();
        process.exit(0);
    } catch (err) {
        if (err instanceof CliError) {
            console.error(err.message);
            process.exit(1);
        }
        // unexpected error - print stack trace
        console.error(
            'Something went wrong, please try again or contact support if issue persists.'
        );
        console.error(err);
        process.exit(1);
    }
})();
