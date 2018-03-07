import glob from "./glob-promise";

const locate = (paths: Array<String>, configName: String, type: String, extensions: Array<String> = []) => {
    return new Promise((resolve, reject) => {
        let promises = [];

        if (extensions.length > 0) {
            paths = addExtension(paths, extensions);
        }

        for (let i = 0; i < paths.length; i++) {
            promises.push(glob(paths[i]));
        }

        Promise.all(promises).then(data => {
            let arr:Array<String> = [];
            for (let i = 0; i < data.length; i++) {
                arr = [...arr, ...data[i]];
            }

             filterPaths(flattenDeep(data), configName, type).then(data => {
                resolve(data);
             });
        });
    });
}

const addExtension = (paths: Array<String>, extensions: Array<String>): Array<String> => {
    let pathsWithExtion: Array<String> = [];
    extensions.forEach(ext => {
        paths.forEach(path => {
            pathsWithExtion.push(`${path}.${ext}`);
        });
    });

    return pathsWithExtion;
}

const flattenDeep = (arr: Array<any>): Array<any> => {
    return Array.isArray(arr) ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], []) : [arr];
}

const filterPaths = (data: Array<String>, configName: String, type: String) => {
    return new Promise((resolve, reject) => {
        let arr: Array<String> = [];
        
        data.forEach(element => {
            let fileName = element.split('/')[element.split('/').length - 1];
            fileName = fileName.split('.')[0];

            if (fileName === configName) {
                arr.push(element);
            } else if (fileName.indexOf('_') > -1) {
                if (fileName.split('_')[0] === configName && fileName.split('_')[1] === type) {
                    arr.push(element);
                }
            }
        });

        resolve(arr);
    });
}

export default locate;