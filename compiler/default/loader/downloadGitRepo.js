import fs from 'fs-extra';
import {get} from '../../lib/utils';
import download from 'download-git-repo';

export async function downloadGitRepo({from, to, tmp}) {
    await new Promise((resolve, reject) => {
        download(from, tmp, {clone: false}, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });

    // return to;
    await fs.move(tmp, to, {overwrite: true});
}
