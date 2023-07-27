import { simpleGit } from 'simple-git';
import Debug from 'debug';

const debug = Debug('mobbdev:git');

export async function getGitInfo(srcDirPath) {
    debug('getting git info for %s', srcDirPath);

    const git = simpleGit({
        baseDir: srcDirPath,
        // binary: 'git123',
        maxConcurrentProcesses: 1,
        trimmed: true,
    });

    let repoUrl = '';
    let hash = '';
    let reference = '';

    try {
        repoUrl = (await git.getConfig('remote.origin.url')).value || '';
        hash = (await git.revparse(['HEAD'])) || '';
        reference = (await git.revparse(['--abbrev-ref', 'HEAD'])) || '';
    } catch (e) {
        debug('failed to run git %o', e);
        if (e.message && e.message.includes(' spawn ')) {
            debug('git cli not installed');
        } else if (e.message && e.message.includes(' not a git repository ')) {
            debug('folder is not a git repo');
        } else {
            throw e;
        }
    }

    // Normalize git URL. We may need more generic code here, but it's not very
    // important at the moment.
    if (repoUrl.endsWith('.git')) {
        repoUrl = repoUrl.slice(0, -'.git'.length);
    }

    if (repoUrl.startsWith('git@github.com:')) {
        repoUrl = repoUrl.replace('git@github.com:', 'https://github.com/');
    }

    return {
        repoUrl,
        hash,
        reference,
    };
}
