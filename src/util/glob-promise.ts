import * as glob from "glob";

const promise = (pattern) => {
    return new Promise((resolve, reject) => {

        new glob.Glob(pattern, (err, data) => err === null ? resolve(data) : reject(err));
    });
}

export default promise;