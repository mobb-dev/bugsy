import fetch, { FormData, fileFrom, File } from 'node-fetch';
import Debug from 'debug';

const debug = Debug('mobbdev:upload-file');

// `file` can be string representing absolute path or buffer.
export async function uploadFile(file, url, uploadKey, uploadFields) {
    debug('upload file start %s', url);
    debug('upload fields %o', uploadFields);
    debug('upload key %s', uploadKey);

    const form = new FormData();

    for (const key in uploadFields) {
        form.append(key, uploadFields[key]);
    }

    form.append('key', uploadKey);
    if (typeof file === 'string') {
        debug('upload file from path %s', file);
        form.append('file', await fileFrom(file));
    } else {
        debug('upload file from buffer');
        form.append('file', new File([file], 'file'));
    }

    const response = await fetch(url, {
        method: 'POST',
        body: form,
    });

    if (!response.ok) {
        debug('error from S3 %s %s', response.body, response.status);
        throw new Error(`Failed to upload the file: ${response.status}`);
    }
    debug('upload file done');
}
