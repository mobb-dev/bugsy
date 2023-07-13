import fetch, { FormData, fileFrom } from 'node-fetch';
import Debug from 'debug';

const debug = Debug('mobbdev:upload-file');

export async function uploadFile(reportPath, url, uploadKey, uploadFields) {
    debug('upload report file start %s %s', reportPath, url);
    debug('upload fields %o', uploadFields);
    debug('upload key %s', uploadKey);

    const form = new FormData();

    for (const key in uploadFields) {
        form.append(key, uploadFields[key]);
    }

    form.append('key', uploadKey);
    form.append('file', await fileFrom(reportPath));

    const response = await fetch(url, {
        method: 'POST',
        body: form,
    });

    if (!response.ok) {
        debug('error from S3 %s %s', response.body, response.status);
        throw new Error(`Failed to upload the report: ${response.status}`);
    }
    debug('upload report file done');
}
