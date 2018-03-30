import glob from './glob-promise';

const addExtension = (paths: string[], extensions: string[]): string[] =>
  paths.reduce(
    (accumulator, currentPath) => [
      ...accumulator,
      ...extensions.map((ext) => `${currentPath}.${ext.toLowerCase()}`),
    ],
    [],
  );

const filterPaths = (data: string[], configName: string, type: string) =>
  new Promise((resolve, reject) => {
    const arr: string[] = [];

    data.forEach((element) => {
      const fileName = element
        .split('/')
        [element.split('/').length - 1].split('.')[0];

      if (fileName === configName) {
        arr.push(element);
      } else if (fileName.includes('_')) {
        if (
          fileName.split('_')[0] === configName &&
          fileName.split('_')[1] === type
        ) {
          arr.push(element);
        }
      }
    });

    resolve(arr);
  });

const flattenDeep = (arr: any[]): any[] =>
  Array.isArray(arr)
    ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], [])
    : [arr];

export const configLocate = (
  paths: string[],
  configName: string,
  type: string,
  extensions: string[] = [],
): Promise<any> =>
  new Promise((resolve, reject) => {
    paths.map((path) => path.toLowerCase());
    if (extensions.length > 0) {
      paths = addExtension(paths, extensions);
    }

    Promise.all(paths.map(glob)).then((data) => {
      filterPaths(
        flattenDeep(data.map((el) => el.sort())),
        configName,
        type,
      ).then(resolve);
    });
  });

export const locate = (
  paths: string[],
  extensions: string[] = [],
): Promise<any> =>
  new Promise((resolve, reject) => {
    paths.map((path) => path.toLowerCase());

    if (extensions.length > 0) {
      paths = addExtension(paths, extensions);
    }

    Promise.all(paths.map(glob))
      .then((data) => flattenDeep(data.map((el) => el.sort())))
      .then(resolve);
  });

export default locate;
