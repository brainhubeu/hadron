import locate from './file-locator';
import * as fs from 'fs';
import * as convert from 'xml-js';
import { relative } from 'path';

const types = {
    JS: 'js',
    JSON: 'json',
    XML: 'xml'
}

const validExtension = (path: String, extension: String) => {
    if (path.split('.')[path.split('.').length - 1] !== extension) {
        return false;
    }

    return true;
}

export const jsonLoader = (path) => {
    return new Promise((resolve, reject) => {
        if (path.split('.')[path.split('.').length - 1] !== types.JSON) {
            reject(new Error(`${path} don't have a ${types.JSON} extension`));
        }

        fs.readFile(path, 'utf8', (err, data) => {
            err ? reject(err) : resolve(JSON.parse(data));
        });
    });
}

export const jsLoader = (path) => {

};

export const xmlLoader = (path) => {
    
}
