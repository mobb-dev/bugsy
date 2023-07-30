import {
    afterAll,
    afterEach,
    beforeAll,
    it,
    jest,
    expect,
} from '@jest/globals';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import tmp from 'tmp';

import Configstore from 'configstore';
const PROJECT_PAGE_REGEX =
    /^http:\/\/(127\.0\.0\.1)|(localhost):5173\/organization\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/project\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const config = new Configstore(packageJson.name);

let tmpObj;

afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
});

beforeAll(() => {
    tmpObj = tmp.dirSync({
        unsafeCleanup: true,
    });
});

afterAll(() => {
    tmpObj.removeCallback();
});

it('Full analyze flow', async () => {
    config.set('token', process.env.TOKEN);
    const getSnykReportMock = jest
        .fn()
        .mockImplementation(async (reportPath) => {
            fs.copyFileSync(path.join(__dirname, 'report.json'), reportPath);
            return true;
        });

    jest.unstable_mockModule('../src/features/analysis/snyk.mjs', () => ({
        getSnykReport: getSnykReportMock,
    }));

    const openMock = jest.fn();

    jest.unstable_mockModule('open', () => ({
        default: openMock,
    }));

    const { runAnalysis } = await import('../src/features/analysis/index.mjs');

    await runAnalysis(
        {
            repo: 'https://github.com/mobb-dev/simple-vulnerable-java-project',
        },
        { skipPrompts: true }
    );

    expect(getSnykReportMock).toHaveBeenCalled();
    expect(openMock).toHaveBeenCalledTimes(1);
    expect(openMock.mock.calls[0][0]).toMatch(PROJECT_PAGE_REGEX);
}, 30000);

it('Direct repo upload', async () => {
    config.set('token', process.env.TOKEN);
    const openMock = jest.fn();

    jest.unstable_mockModule('open', () => ({
        default: openMock,
    }));

    const { runAnalysis } = await import('../src/features/analysis/index.mjs');

    await runAnalysis(
        {
            repo: 'https://bitbucket.com/a/b',
            branch: 'test',
            commitHash: 'ad00119b0d4a56f44a49d3d20eccb77978a363f8',
            scanFile: path.join(__dirname, 'assets/simple/codeql_report.json'),
            srcPath: path.join(__dirname, 'assets/simple'),
        },
        { skipPrompts: true }
    );

    expect(openMock).toHaveBeenCalledTimes(1);
    expect(openMock.mock.calls[0][0]).toMatch(PROJECT_PAGE_REGEX);
});
