/**
 * @file builder
 * @author tanglei (tanglei02@baidu.com)
 */

import path from 'path';
import fs from 'fs-extra';

import {classify} from '../utils';

import {
    BEFORE_STORE,
    AFTER_STORE
} from './plugin';

export default function (app, addModule) {
    const builder = {
        async build(list) {
            let {parser, store, plugin} = app.module;

            list = list.filter(info => path.extname(info.dir) === '.md');

            let {toUpdate, toDelete} = classify(
                list,
                ({type}) => type === 'delete' ? 'toDelete' : 'toUpdate'
            );

            await Promise.all([
                ...toUpdate.map(async info => {
                    let md = await fs.readFile(info.fullDir, 'utf-8');
                    let html = await parser.parse(md, info);

                    let obj = {html, dir: info.dir};

                    obj = await plugin.exec(BEFORE_STORE, obj, info);

                    await store.set('article', info.dir, obj);
                    await plugin.exec(AFTER_STORE, obj, info);
                }),
                ...toDelete.map(async info => {
                    await store.delete('article', info.dir);
                })
            ]});
        }
    };

    addModule('builder', {
        module: builder
    });
}
