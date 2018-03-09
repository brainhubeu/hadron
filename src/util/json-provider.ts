import * as fs from "fs";
import { relative } from "path";
import { parseString as xmlToJson } from "xml2js";
import locate from "./file-locator";

const getExtension = (path: string): string => {
    return path.split(".")[path.split(".").length - 1].toLowerCase();
};

export const jsonLoader = (path: string) => {
    return new Promise((resolve, reject) => {
        if (getExtension(path) !== Object.keys(mapper)[1]) {
            reject(new Error(`${path} doesn't have a ${Object.keys(mapper)[1]} extension`));
        }

        fs.readFile(path, "utf8", (err, data) => {
            err ? reject(err) : resolve(JSON.parse(data));
        });
    });
};

export const jsLoader = (path: string) => {
    return new Promise((resolve, reject) => {
        if (getExtension(path) !== Object.keys(mapper)[0]) {
            reject(new Error(`${path} doesn't have ${Object.keys(mapper)[0]} extension`));
        }

        const data = require(`./${relative(__dirname, path)}`);
        data !== null ? resolve(data()) : reject(new Error("File not found"));
    });
};

export const xmlLoader = (path: string) => {
    return new Promise((resolve, reject) => {
        if (getExtension(path) !== Object.keys(mapper)[2]) {
            reject(new Error(`${path} doesn't have ${Object.keys(mapper)[2]} extension`));
        }

        fs.readFile(path, "utf8", (err, data) => {
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

const extensionMapper = (paths: string[]): Array<Promise<any>> => {
    return paths.map((path) => {
        const ext = path.split(".")[path.split(".").length - 1];
        return mapper[ext](path);
    });
};

const jsonProvider = (paths: string[], configName: string, type: string, extensions: string[] = []) => {
    return locate(paths, configName, type, extensions)
    .then((locatedPaths) => Promise.all(extensionMapper(locatedPaths)))
    .then((data) => Object.assign({}, ...data));
};

export default jsonProvider;
