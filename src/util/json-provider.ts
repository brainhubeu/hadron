import * as fs from 'fs';
import { extname, relative } from 'path';
import { parseString as xmlToJson } from 'xml2js';
import locate from './file-locator';

const getExtension = (path: string): string =>
  extname(path).substring(1);

export const jsLoader = (path: string) => {
  const supportsExtension: string = 'js';
  return new Promise((resolve, reject) => {
    if (getExtension(path) !== supportsExtension) {
      reject(new Error(`${path} doesn't have ${supportsExtension} extension`));
    }

    const data = require(`./${relative(__dirname, path)}`);
    data !== null ? resolve(data()) : reject(new Error('File not found'));
  });
};

export const jsonLoader = (path: string) => {
  const supportsExtension: string = 'json';
  return new Promise((resolve, reject) => {
    if (getExtension(path) !== supportsExtension) {
      reject(new Error(`${path} doesn't have a ${supportsExtension} extension`));
    }

    fs.readFile(path, 'utf8', (err, data) => {
      err ? reject(err) : resolve(JSON.parse(data));
    });
  });
};

export const xmlLoader = (path: string) => {
  const supportsExtension: string = 'xml';
  return new Promise((resolve, reject) => {
    if (getExtension(path) !== supportsExtension) {
      reject(new Error(`${path} doesn't have ${supportsExtension} extension`));
    }

    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      xmlToJson(data, (jsonErr: Error, jsonData: string) => {
        if (jsonErr) {
          reject(jsonErr);
        }
        resolve(jsonData);
      });
    });
  });
};

const mapper: any = {
  js: jsLoader,
  json: jsonLoader,
  xml: xmlLoader,
};

const extensionMapper = (paths: string[]): Array<Promise<any>> => paths.map(path => mapper[getExtension(path)](path));


const jsonProvider = (paths: string[], configName: string,
                      type: string, extensions: string[] = []): Promise<object> =>
  locate(paths, configName, type, extensions)
    .then(locatedPaths => Promise.all(extensionMapper(locatedPaths)))
    .then(data => Object.assign({}, ...data));

export default jsonProvider;
