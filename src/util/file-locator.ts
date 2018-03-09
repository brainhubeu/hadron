import glob from "./glob-promise";

const locate = (paths: Array<string>, configName: string, type: string, extensions: Array<string> = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (extensions.length > 0) {
            paths = addExtension(paths, extensions);
        }

        Promise.all(paths.map(glob)).then(data => {
             filterPaths(flattenDeep(data.map(el => el.sort())), configName, type).then(data => {
                resolve(data);
             });
        });
    });
}

const addExtension = (paths: Array<string>, extensions: Array<string>): Array<string> => {
    const pathsWithExtension: Array<string> = [];

    extensions.map(ext => {
        paths.map(path => pathsWithExtension.push(`${path}.${ext}`));
    });    

    return pathsWithExtension;
}

const flattenDeep = (arr: Array<any>): Array<any> => {
    return Array.isArray(arr) ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], []) : [arr];
}

const filterPaths = (data: Array<string>, configName: string, type: string) => {
    return new Promise((resolve, reject) => {
        let arr: Array<String> = [];
        
        data.forEach(element => {
            const fileName = (element.split('/')[element.split('/').length - 1]).split('.')[0];

            if (fileName === configName) {
                arr.push(element);
            } else if (fileName.includes('_')) {
                if (fileName.split('_')[0] === configName && fileName.split('_')[1] === type) {
                    arr.push(element);
                }
            }
        });

        resolve(arr);
    });
}

export default locate;
